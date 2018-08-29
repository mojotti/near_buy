import base64
import io
import json
import unittest

from unittest import mock

from app import app
from database import TestDB
from User import User
from samples import items

ITEM1 = items.ITEM1
ITEM2 = items.ITEM2
ITEM3 = items.ITEM3
NEW_ITEM = items.NEW_ITEM
CHAT = items.CHAT

TEST_DB = TestDB()
USER = User(email='test_email', password='test_pw')

app.config.from_object('Config.TestingConfig')
app.static_url_path = app.config.get('STATIC_FOLDER')
app.static_folder = app.root_path + app.static_url_path

TOKEN_FOR_USER_ID_0 = USER.encode_auth_token(0).decode('utf-8')
TOKEN_FOR_USER_ID_1 = USER.encode_auth_token(1).decode('utf-8')

USER_MOJO = {'hash': items.HASH,
             'username': 'mojo',
             'id': 0,
             'token': TOKEN_FOR_USER_ID_0}
USER_KOJO = {'hash': items.HASH_2,
             'username': 'kojo',
             'id': 1,
             'token': TOKEN_FOR_USER_ID_1}


class TestApp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        TEST_DB.create_two_users_to_db()

    @classmethod
    def tearDownClass(cls):
        TEST_DB.users.delete_many({})
        TEST_DB.chats.delete_many({})
        items.rm_test_pictures()

    def setUp(self):
        self.app = app.test_client()
        self.db = TEST_DB
        self.create_two_items()

    def tearDown(self):
        self.db.items.delete_many({})

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    @mock.patch('app.is_allowed_file', return_value=True)
    def create_two_items(self, mock, rock):
        data = {'info': ITEM1}
        data['pictures[]'] = [(io.BytesIO(b"abcdef"), 'test0.jpg'), (io.BytesIO(b"abcdef"), 'test1.jpg')]
        self.app.post('/api/v1.0/items',
                      data=data,
                      content_type='multipart/form-data',
                      headers={'Authorization':
                               'Bearer ' + TOKEN_FOR_USER_ID_0})
        data = {'info': ITEM2}
        data['pictures[]'] = [(io.BytesIO(b"ghijkl"), 'test2.jpg'), (io.BytesIO(b"ghijkl"), 'test3.jpg')]
        self.app.post('/api/v1.0/items',
                      data=data,
                      content_type='multipart/form-data',
                      headers={'Authorization':
                               'Bearer ' + TOKEN_FOR_USER_ID_0})

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_KOJO)
    @mock.patch('app.is_allowed_file', return_value=True)
    def create_item_for_user_one(self, mock, rock):
        data = {'info': ITEM3}
        data['pictures[]'] = [(io.BytesIO(b"abcdef"), 'test0.jpg'), (io.BytesIO(b"abcdef"), 'test1.jpg')]
        self.app.post('/api/v1.0/items',
                      data=data,
                      content_type='multipart/form-data',
                      headers={'Authorization':
                                   'Bearer ' + TOKEN_FOR_USER_ID_1})

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_item_two_is_retrieved_then_it_is_not_sold(self, mock):
        response = self.app.get('/api/v1.0/items/1',
                                headers={'Authorization':
                                         'Bearer ' + TOKEN_FOR_USER_ID_0})
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertFalse(json_resp['item']['sold'])

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    @mock.patch('database.DatabaseHelper.get_id_for_new_item', return_value=100)
    @mock.patch('app.is_allowed_file', return_value=True)
    def test_given_there_is_two_items_in_db_when_new_items_is_added_then_status_code_is_201(self, mock, mockk, rock):
        data =  {'info': NEW_ITEM}
        data['pictures[]'] = [(io.BytesIO(b"abcdef"), 'test0.jpg'), (io.BytesIO(b"abcdef"), 'test1.jpg')]
        response = self.app.post('/api/v1.0/items',
                                 data=data,
                                 content_type='multipart/form-data',
                                 headers={'Authorization':
                                          'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.db.items.count(), 3)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    @mock.patch('app.is_allowed_file', return_value=True)
    def test_given_there_is_two_items_in_db_when_new_item_is_created_then_it_can_be_retrieved(self, mock, rock):
        data =  {'info': NEW_ITEM}
        data['pictures[]'] = [(io.BytesIO(b"abcdef"), 'test0.jpg'), (io.BytesIO(b"abcdef"), 'test1.jpg')]
        response = self.app.post('/api/v1.0/items',
                                 data=data,
                                 content_type='multipart/form-data',
                                 headers={'Authorization':
                                          'Bearer ' + TOKEN_FOR_USER_ID_0})
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json_resp['item']['title'], 'new_item')
        self.assertEqual(json_resp['item']['price'], 100)
        self.assertEqual(json_resp['item']['seller_id'], 0)  # user 'mojo' was used to login
        self.assertEqual(self.db.items.count(), 3)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_item_number_five_is_requested_then_it_can_not_be_retrieved(self, mock):
        response = self.app.get(
            '/api/v1.0/items/5',
            headers={'Authorization':
                    'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 404)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_item_number_one_is_deleted_it_cannot_be_found(self, mock):
        self.app.delete(
            '/api/v1.0/items/1',
            headers={'Authorization':
                    'Bearer ' + TOKEN_FOR_USER_ID_0})
        response = self.app.get(
            '/api/v1.0/items/1',
            headers={'Authorization':
                    'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(self.db.retrieve_item_with_id(1), None)
        self.assertEqual(self.db.items.count(), 1)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_user_has_two_items_in_db_when_one_is_deleted_it_cannot_be_found(self, mock):
        delete = self.app.delete(
            '/api/v1.0/user/items/0',
            headers={'Authorization':
                    'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(delete.status_code, 200)
        response = self.app.get(
            '/api/v1.0/user/items',
            headers={'Authorization':
                    'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 200)

        user_items = self.db.retrieve_items_with_seller_id(0)
        user_items = [item for item in user_items]

        self.assertEqual(len(user_items), 1)
        self.assertEqual(self.db.items.count(), 1)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_when_trying_to_delete_non_existing_user_item_then_error_is_raised(self, mock):
        delete = self.app.delete(
            '/api/v1.0/user/items/10000',
            headers={'Authorization':
                    'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(delete.status_code, 404)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_when_trying_to_delete_non_existing_item_then_error_is_raised(self, mock):
        delete = self.app.delete(
            '/api/v1.0/items/10000',
            headers={'Authorization':
                    'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(delete.status_code, 404)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_invalid_item_is_created_then_status_code_400_is_retrieved(self, mock):
        item = {'description': 'fake_news'}  # no title or price
        response = self.app.post('/api/v1.0/items',
                                 data=json.dumps(item),
                                 content_type='application/json',
                                 headers={'Authorization':
                                        'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.db.items.count(), 2)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_user_has_two_items_in_db_when_items_are_requested_then_they_are_retrieved(self, mock):
        response = self.app.get(
            '/api/v1.0/user/items',
            headers={'Authorization':
                    'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 200)
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEqual(len(json_resp['items']), 2)
        for item in json_resp['items']:
            self.assertEqual(item['seller_id'], 0)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_KOJO)
    def test_given_there_are_two_items_in_db_when_user_zeros_item_is_requested_then_it_is_retrieved(self, mock):
        response = self.app.get(
            '/api/v1.0/user/items',
            headers={'Authorization':
                         'Bearer ' + TOKEN_FOR_USER_ID_1})
        self.assertEqual(response.status_code, 200)
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEqual(json_resp['items'], 'no items')

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_KOJO)
    def test_given_there_are_two_items_in_db_when_items_by_others_are_requested_then_they_are_retrieved(self, mock):
        self.create_item_for_user_one()

        response = self.app.get(
            '/api/v1.0/items_from_others',
            headers={'Authorization':
                         'Bearer ' + TOKEN_FOR_USER_ID_1})
        self.assertEqual(response.status_code, 200)
        others_items = json.loads(response.data.decode('utf-8'))

        response = self.app.get(
            '/api/v1.0/items',
            headers={'Authorization':
                         'Bearer ' + TOKEN_FOR_USER_ID_1})
        self.assertEqual(response.status_code, 200)
        all_items = json.loads(response.data.decode('utf-8'))

        self.assertEquals(len(others_items['items']), 2)
        self.assertEquals(len(all_items['items']), 3)

    @mock.patch('database.DatabaseHelper.create_new_user_to_database', return_value=None)
    def test_given_user_has_valid_user_info_when_user_registers_then_it_is_successful(self, mock):
        user_info = {
            'user_info': base64.b64encode(b'user:pw:email').decode('utf-8')
        }
        response = self.app.post(
            '/api/v1.0/register',
            data=json.dumps(user_info),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEqual(json_resp['user_creation'], 'success')

    @mock.patch('database.DatabaseHelper.create_new_user_to_database', return_value='user exists already')
    def test_given_user_exists_when_user_registers_then_it_is_not_successful(self, mock):
        user_info = {
            'user_info': base64.b64encode(b'user:pw:email').decode('utf-8')
        }
        response = self.app.post(
            '/api/v1.0/register',
            data=json.dumps(user_info),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEqual(json_resp['user_creation'], 'user exists')

    def test_given_user_has_invalid_user_info_when_user_registers_then_it_is_not_successful(self):
        user_info = {  # missing pw
            'user_info': base64.b64encode(b'user:pw:').decode('utf-8')
        }
        response = self.app.post(
            '/api/v1.0/register',
            data=json.dumps(user_info),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    def test_given_folder_has_images_when_requested_then_images_are_shown(self):
        response = self.app.get(
            '/api/v1.0/1/image0.jpg',
            headers={'Authorization': 'Bearer ' + TOKEN_FOR_USER_ID_1})
        self.assertEqual(response.status_code, 200)

    def test_given_folder_has_images_when_requested_then_num_of_images_is_retrieved(self):
        response = self.app.get(
            '/api/v1.0/1/num_of_images',
            headers={'Authorization': 'Bearer ' + TOKEN_FOR_USER_ID_1})
        self.assertEqual(response.status_code, 200)
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEqual(json_resp['num_of_images'], 2)

    def test_given_folder_has_no_images_when_requested_then_num_of_images_is_zero(self):
        response = self.app.get(
            '/api/v1.0/1000/num_of_images',
            headers={'Authorization': 'Bearer ' + TOKEN_FOR_USER_ID_1})
        self.assertEqual(response.status_code, 200)
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEqual(json_resp['num_of_images'], 0)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    @mock.patch('database.DatabaseHelper.create_a_new_chat_for_item', return_value=None)
    @mock.patch('database.DatabaseHelper.create_a_new_chat_for_item', return_value=None)
    def test_given_chats_is_created_when_successful_then_ok_is_returned(self, mock, rock, dock):
        data = {'other_user': 1, 'item_id': 2}
        response = self.app.post(
            '/api/v1.0/new_chat',
            headers={'Authorization':
                    'Bearer ' + TOKEN_FOR_USER_ID_0},
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertTrue(json_resp['ok'])

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    @mock.patch('database.DatabaseHelper.get_all_chats_for_user', return_value=CHAT)
    def test_given_chat_is_in_db_when_it_is_requested_then_it_is_found(self, mock, rock):
        response = self.app.get(
            '/api/v1.0/chats',
            headers={'Authorization':
                    'Bearer ' + TOKEN_FOR_USER_ID_0},
        )
        self.assertEqual(response.status_code, 200)
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEquals(json_resp['chats'][0]['id'], 0)
        self.assertEquals(json_resp['chats'][0]['buyer_id'], 1)
        self.assertEquals(json_resp['chats'][0]['seller_id'], 0)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    @mock.patch('database.DatabaseHelper.is_existing_chat', return_value=True)
    def test_given_chat_exists_when_its_requested_it_is_not_created_again(self, mock, rock):
        data = {'other_user': 1, 'item_id': 2}
        response = self.app.post(
            '/api/v1.0/new_chat',
            headers={'Authorization':
                         'Bearer ' + TOKEN_FOR_USER_ID_0},
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEquals(json_resp['ok'], 'chat exists')



