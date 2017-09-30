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
USER_MOJO = {'hash': items.HASH,
             'username': 'mojo',
             'id': 0,
             'token': TOKEN_FOR_USER_ID_0}


class TestApp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        TEST_DB.create_two_users_to_db()

    @classmethod
    def tearDownClass(cls):
        TEST_DB.users.remove({})

    def setUp(self):
        self.app = app.test_client()
        self.db = TEST_DB
        self.create_two_items()

    def tearDown(self):
        self.db.items.remove({})

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def create_two_items(self, mock):
        self.app.post('/todo/api/v1.0/items',
                      data=json.dumps(ITEM1),
                      content_type='application/json',
                      headers={'Authorization':
                               'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.app.post('/todo/api/v1.0/items',
                      data=json.dumps(ITEM2),
                      content_type='application/json',
                      headers={'Authorization':
                               'Bearer ' + TOKEN_FOR_USER_ID_0})

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_item_two_is_retrieved_then_it_is_not_sold(self, mock):
        response = self.app.get('/todo/api/v1.0/items/1',
                                headers={'Authorization':
                                        'Bearer ' + TOKEN_FOR_USER_ID_0})
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertFalse(json_resp['item']['sold'])

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_new_items_is_added_then_status_code_is_201(self, mock):
        response = self.app.post('/todo/api/v1.0/items',
                                 data=json.dumps(NEW_ITEM),
                                 content_type='application/json',
                                 headers={'Authorization':
                                         'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.db.items.count(), 3)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_new_item_is_created_then_it_can_be_retrieved(self, mock):
        response = self.app.post('/todo/api/v1.0/items',
                                 data=json.dumps(NEW_ITEM),
                                 content_type='application/json',
                                 headers={'Authorization':
                                         'Bearer ' + TOKEN_FOR_USER_ID_0})
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEquals(response.status_code, 201)
        self.assertEqual(json_resp['item']['title'], 'Almost new pair of socks')
        self.assertEqual(json_resp['item']['price'], 2)
        self.assertEqual(json_resp['item']['seller_id'], 0)  # user 'mojo' was used to login
        self.assertEqual(self.db.items.count(), 3)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_item_number_five_is_requested_then_it_can_not_be_retrieved(self, mock):
        response = self.app.get(
            '/todo/api/v1.0/items/5',
            headers={'Authorization':
                    'Bearer ' + str(TOKEN_FOR_USER_ID_0)})
        self.assertEqual(response.status_code, 404)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_item_number_one_is_deleted_it_cannot_be_found(self, mock):
        self.app.delete(
            '/todo/api/v1.0/items/1',
            headers={'Authorization':
                    'Bearer ' + TOKEN_FOR_USER_ID_0})
        response = self.app.get(
            '/todo/api/v1.0/items/1',
            headers={'Authorization':
                    'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(self.db.retrieve_item_with_id(1), None)
        self.assertEqual(self.db.items.count(), 1)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_invalid_item_is_created_then_status_code_400_is_retrieved(self, mock):
        item = {'description': 'fake_news'}  # no title or price
        response = self.app.post('/todo/api/v1.0/items',
                                 data=json.dumps(item),
                                 content_type='application/json',
                                 headers={'Authorization':
                                        'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.db.items.count(), 2)

