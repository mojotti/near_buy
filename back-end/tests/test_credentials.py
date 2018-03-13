import unittest
from unittest import mock
from unittest.mock import MagicMock

from flask import json

from app import app
from database import TestDB
from User import User
from samples import items

ITEM1 = items.ITEM1
ITEM2 = items.ITEM2

NEW_ITEM = {'title': 'Read a book'}
TEST_DB = TestDB()
USER = User(email='test_email', password='test_pw')

app.config.from_object('Config.TestingConfig')

TOKEN_FOR_USER_ID_0 = USER.encode_auth_token(0).decode('utf-8')
INVALID_TOKEN = USER.encode_auth_token('lol').decode('utf-8')  # no such a user in db
USER_MOJO = {'hash': items.HASH,
             'username': 'mojo',
             'id': 0,
             'token': TOKEN_FOR_USER_ID_0}


class TestCredentials(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        TEST_DB.create_two_users_to_db()
        TEST_DB.items.insert_one(ITEM1)
        TEST_DB.items.insert_one(ITEM2)

    @classmethod
    def tearDownClass(cls):
        TEST_DB.users.delete_many({})
        TEST_DB.items.delete_many({})

    def setUp(self):
        self.app = app.test_client()

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_item_2_is_requested_with_valid_token_then_it_is_retrieved(self, mock):
        TEST_DB.retrieve_user_by_username = MagicMock(return_value=TOKEN_FOR_USER_ID_0)
        response = self.app.get(
            '/api/v1.0/items/2',
            headers={'Authorization':
                     'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status, '200 OK')

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value='')
    def test_given_there_is_two_items_in_db_when_item_is_requested_with_invalid_token_then_item_2_is_not_retrieved(self, mock):
        response = self.app.get(
            '/api/v1.0/items/2',
            headers={'Authorization':
                     'Bearer ' + INVALID_TOKEN})
        self.assertEqual(response.status, '403 FORBIDDEN')

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_items_in_db_when_correct_token_are_entered_then_all_items_are_retrieved(self, mock):
        TEST_DB.retrieve_user_by_username = MagicMock(return_value=TOKEN_FOR_USER_ID_0)
        response = self.app.get(
            'api/v1.0/items',
            headers={'Authorization':
                     'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(response.status, '200 OK')

    def test_given_there_is_two_items_in_db_when_new_item_is_created_without_token_then_status_code_is_403(self):
        response = self.app.post('api/v1.0/items',
                                 data=json.dumps(NEW_ITEM),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 403)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value='')
    def test_given_there_is_two_items_in_db_when_new_item_is_created_with_invalid_token_then_status_code_is_403(self, mock):
        response = self.app.post('api/v1.0/items',
                                 data=json.dumps(NEW_ITEM),
                                 content_type='application/json',
                                 headers={'Authorization':
                                          'Bearer ' + INVALID_TOKEN})
        self.assertEqual(response.status_code, 403)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value='')
    def test_given_there_is_two_items_in_db_when_item_is_updated_with_invalid_token_then_status_code_is_403(self, mock):
        update = '{"sold":true}'
        response = self.app.put('api/v1.0/items/2',
                                data=update,
                                content_type='application/json',
                                headers={'Authorization':
                                         'Bearer ' + INVALID_TOKEN})
        self.assertEqual(response.status_code, 403)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value='')
    def test_given_there_is_two_items_in_db_when_item_is_deleted_with_invalid_token_then_status_code_is_403(self, mock):
        response = self.app.delete('api/v1.0/items/2',
                                   content_type='application/json',
                                   headers={'Authorization':
                                            'Bearer ' + INVALID_TOKEN})
        self.assertEqual(response.status_code, 403)
