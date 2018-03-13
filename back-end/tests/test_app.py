import base64
import json
import unittest

from unittest import mock

from app import app
from database import TestDB
from User import User
from samples import items

ITEM1 = items.ITEM1
ITEM2 = items.ITEM2
NEW_ITEM = items.NEW_ITEM

TEST_DB = TestDB()
USER = User(email='test_email', password='test_pw')

app.config.from_object('Config.TestingConfig')
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

    def setUp(self):
        self.app = app.test_client()
        self.db = TEST_DB
        self.create_two_items()

    def tearDown(self):
        self.db.items.delete_many({})

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def create_two_items(self, mock):
        self.app.post('/api/v1.0/items',
                      data=json.dumps(ITEM1),
                      content_type='application/json',
                      headers={'Authorization':
                               'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.app.post('/api/v1.0/items',
                      data=json.dumps(ITEM2),
                      content_type='application/json',
                      headers={'Authorization':
                               'Bearer ' + TOKEN_FOR_USER_ID_0})

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_item_two_is_retrieved_then_it_is_not_sold(self, mock):
        response = self.app.get('/api/v1.0/items/1',
                                headers={'Authorization':
                                        'Bearer ' + TOKEN_FOR_USER_ID_0})
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertFalse(json_resp['item']['sold'])

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_new_items_is_added_then_status_code_is_201(self, mock):
        response = self.app.post('/api/v1.0/items',
                                 data=json.dumps(NEW_ITEM),
                                 content_type='application/json',
                                 headers={'Authorization':
                                         'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.db.items.count(), 3)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_new_item_is_created_then_it_can_be_retrieved(self, mock):
        response = self.app.post('/api/v1.0/items',
                                 data=json.dumps(NEW_ITEM),
                                 content_type='application/json',
                                 headers={'Authorization':
                                         'Bearer ' + TOKEN_FOR_USER_ID_0})
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json_resp['item']['title'], 'Almost new pair of socks')
        self.assertEqual(json_resp['item']['price'], 2)
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
    def test_given_there_is_two_items_in_db_when_user_zeros_item_is_requested_then_it_is_retrieved(self, mock):
        response = self.app.get(
            '/api/v1.0/user/items',
            headers={'Authorization':
                         'Bearer ' + TOKEN_FOR_USER_ID_1})
        self.assertEqual(response.status_code, 200)
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEqual(json_resp['items'], 'no items')

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



