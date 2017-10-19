import base64
import unittest
from unittest import mock

from flask import json

from app import app
from database import TestDB
from User import User
from samples import items
import database


TEST_DB = TestDB()

VALID_CREDENTIALS1 = base64.b64encode(b'mojo:best_password_ever').decode('utf-8')
INVALID_CREDENTIALS = base64.b64encode(b'coyote:totally_wrong_pw').decode('utf-8')
NEW_ITEM1 = items.NEW_ITEM

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


class TestUser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        TEST_DB.create_two_users_to_db()

    def setUp(self):
        self.db = TEST_DB
        self.app = app.test_client()

    def tearDown(self):
        self.db.items.remove({})

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_there_is_two_users_when_user_1_puts_item_to_sell_then_item_has_user_1s_id(self, mock):
        self.assertEquals(self.db.items.count(), 0)
        self.app.post('/api/v1.0/items',
                      data=json.dumps(NEW_ITEM1),
                      content_type='application/json',
                      headers={'Authorization':
                               'Bearer ' + TOKEN_FOR_USER_ID_0})
        self.assertEqual(self.db.items.count(), 1)
        for item in self.db.retrieve_items():  # only one item in db
            self.assertEquals(item['seller_id'], 0)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_KOJO)
    def test_given_there_is_two_users_when_user_2_puts_item_to_sell_then_item_has_user_2s_id(self, mock):
        self.assertEquals(self.db.items.count(), 0)
        self.app.post('/api/v1.0/items',
                      data=json.dumps(NEW_ITEM1),
                      content_type='application/json',
                      headers={'Authorization':
                               'Bearer ' + TOKEN_FOR_USER_ID_1})
        self.assertEqual(self.db.items.count(), 1)
        for item in self.db.retrieve_items():  # only one item in db
            self.assertEquals(item['seller_id'], 1)  # id = 1, because user 'kojo' was used to login

    @mock.patch('database.DatabaseHelper.is_valid_hash_for_user', return_value=True)
    def test_given_user_has_signed_up_when_she_enters_credentials_then_she_can_authenticate(self, hash):
        rv = self.app.get('/api/v1.0/auth',
                          content_type='application/json',
                          headers={'Authorization':
                                   'Basic ' +
                                   VALID_CREDENTIALS1})
        self.assertEquals(rv.status_code, 200)

    @mock.patch('database.DatabaseHelper.is_valid_hash_for_user', return_value=False)
    def test_given_user_has_not_signed_up_when_she_enters_credentials_then_she_can_not_authenticate(self, mock):
        rv = self.app.get('/api/v1.0/auth',
                          content_type='application/json',
                          headers={'Authorization':
                                   'Basic ' +
                                   INVALID_CREDENTIALS})
        self.assertEquals(rv.status_code, 403)

    @mock.patch('database.DatabaseHelper.retrieve_user_by_token', return_value=USER_MOJO)
    def test_given_when_user_has_no_items_in_db_when_user1_creates_item_then_user2_cannot_modify_that_item(self, mock):
        self.create_new_item(NEW_ITEM1, TOKEN_FOR_USER_ID_0)
        update = {'sold': True}
        database.DatabaseHelper.retrieve_user_by_token.return_value = USER_KOJO
        response = self.app.put('api/v1.0/items/0',
                                data=json.dumps(update),
                                content_type='application/json',
                                headers={'Authorization':
                                         'Bearer ' +
                                         TOKEN_FOR_USER_ID_1})
        self.assertEqual(response.status_code, 403)

    @mock.patch('database.DatabaseHelper.is_valid_hash_for_user', return_value=True)
    @mock.patch('database.DatabaseHelper.retrieve_user_by_username', return_value=USER_MOJO)
    def test_given_user_has_signed_up_when_she_logs_in_then_she_gets_token_as_response(self, mock, patch):
        rv = self.app.get('/api/v1.0/auth',
                          content_type='application/json',
                          headers={'Authorization':
                                   'Basic ' +
                                   VALID_CREDENTIALS1})
        self.assertEquals(rv.status_code, 200)
        user = User(email='mojo', password='best_password_ever')
        token = user.encode_auth_token(0).decode('utf-8')
        json_resp = json.loads(rv.data.decode('utf-8'))
        self.assertEquals(json_resp['token'], token)
        self.assertEquals(json_resp['username'], 'mojo')

    def create_new_item(self, item, token):
        self.app.post('/api/v1.0/items',
                      data=json.dumps(item),
                      content_type='application/json',
                      headers={'Authorization': 'Bearer ' + token})

    @mock.patch('database.DatabaseHelper.is_valid_hash_for_user', return_value=False)
    def test_given_user_has_not_signed_up_when_she_logs_in_then_she_gets_error_msg_as_response(self, mock):
        rv = self.app.get('/api/v1.0/auth',
                          content_type='application/json',
                          headers={'Authorization':
                                   'Basic ' +
                                   INVALID_CREDENTIALS})
        self.assertEquals(rv.status_code, 403)
        json_resp = json.loads(rv.data.decode('utf-8'))
        self.assertEquals(json_resp['error'], 'Unauthorized access')

