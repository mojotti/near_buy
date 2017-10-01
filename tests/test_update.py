import json
import unittest
from unittest import mock

from app import app
from database import TestDB
from User import User
from samples import items

ITEM1 = items.ITEM1
ITEM2 = items.ITEM2
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
        self.db.items.insert(ITEM1)
        self.db.items.insert(ITEM2)

    def tearDown(self):
        self.db.items.remove({})

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_item_is_updated_then_it_is_changed(self, mock):
        update = {'sold': True}
        response = self.app.put('api/v1.0/items/2',
                                data=json.dumps(update),
                                content_type='application/json',
                                headers={'Authorization':
                                        'Bearer ' + TOKEN_FOR_USER_ID_0})
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertTrue(json_resp['item']['sold'])
        item_in_db = self.db.retrieve_item_with_title(u'MacBook Air mid 2012')
        self.assertTrue(item_in_db['sold'])

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_item_update_is_not_in_json_then_error_400_is_retrieved(self, mock):
        update = {'sold': True}
        response = self.app.put('api/v1.0/items/2',
                                data=json.dumps(update),
                                headers={'Authorization':
                                        'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 400)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_item_is_updated_when_item_title_is_not_string_code_then_error_400_is_retrieved(self, mock):
        update = {'title': 111}
        response = self.app.put('api/v1.0/items/2',
                                data=json.dumps(update),
                                content_type='application/json',
                                headers={'Authorization':
                                        'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 400)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_item_is_updated_when_item_update_description_is_not_string_then_error_code_400_is_retrieved(self, mock):
        update = {'description': 1234456789}
        response = self.app.put('api/v1.0/items/2',
                                data=json.dumps(update),
                                content_type='application/json',
                                headers={'Authorization':
                                        'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 400)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_item_is_updated_when_sold_is_not_bool_code_then_error_code_400_is_retrieved(self, mock):
        update = {'sold': 'not_bool'}
        response = self.app.put('api/v1.0/items/2',
                                data=json.dumps(update),
                                content_type='application/json',
                                headers={'Authorization':
                                        'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status_code, 400)
