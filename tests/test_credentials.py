import base64
import unittest

from flask import json

from app import app
from database import TestDB
from User import User

ITEM1 = {
    'id': 1,
    'title': u'Nike Shoes AirMax',
    'price': 15,
    'description': u'Hardly used air maxes. Get em while you can',
    'sold': False,
    'location': '-121.45356 46.51119 4392'
    }
ITEM2 = {
    'id': 2,
    'title': u'MacBook Air mid 2012',
    'price': 600,
    'description': u'Killer Mac for serious use. You will love it.',
    'sold': False,
    'location': '-121.45356 46.51119 4392'
    }

NEW_ITEM = {'title': 'Read a book'}
VALID_CREDENTIALS = base64.b64encode(b'mojo:best_password_ever').decode('utf-8')
INVALID_PASSWORD = base64.b64encode(b'mojo:wrong_password').decode('utf-8')
INVALID_USERNAME = base64.b64encode(b'wrong_username:very_good_password').decode('utf-8')

TEST_DB = TestDB()
user = User(email='test_email', password='test_pw')

app.config.from_object('Config.TestingConfig')


class TestCredentials(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        TEST_DB.create_two_users_to_db()
        TEST_DB.items.insert(ITEM1)
        TEST_DB.items.insert(ITEM2)

    @classmethod
    def tearDownClass(cls):
        TEST_DB.users.remove({})
        TEST_DB.items.remove({})

    def setUp(self):
        self.app = app.test_client()
        self.token_for_user_id_0 = user.encode_auth_token(0).decode('utf-8')
        self.invalid_token = user.encode_auth_token('lol').decode('utf-8')  # no such a user id in db

    def test_given_there_is_two_items_in_db_when_item_2_is_requested_then_it_is_retrieved(self):
        response = self.app.get(
            '/todo/api/v1.0/items/2',
            headers={'Authorization':
                     'Bearer ' + self.token_for_user_id_0})
        self.assertEqual(response.status, '200 OK')

    def test_given_there_is_two_items_in_db_when_item_is_requested_with_invalid_token_then_item_2_is_not_retrieved(self):
        response = self.app.get(
            '/todo/api/v1.0/items/2',
            headers={'Authorization':
                     'Bearer ' + self.invalid_token})
        self.assertEqual(response.status, '403 FORBIDDEN')

    def test_given_there_is_two_items_in_db_when_correct_credentials_are_entered_then_all_items_are_retrieved(self):
        response = self.app.get(
            'todo/api/v1.0/items',
            headers={'Authorization':
                     'Bearer ' + self.token_for_user_id_0})
        self.assertEqual(response.status, '200 OK')

    def test_given_there_is_two_items_in_db_when_new_item_is_created_without_credentials_then_status_code_is_403(self):
        response = self.app.post('todo/api/v1.0/items',
                                 data=json.dumps(NEW_ITEM),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_given_there_is_two_items_in_db_when_new_item_is_created_with_invalid_token_then_status_code_is_403(self):
        response = self.app.post('todo/api/v1.0/items',
                                 data=json.dumps(NEW_ITEM),
                                 content_type='application/json',
                                 headers={'Authorization':
                                          'Bearer ' + self.invalid_token})
        self.assertEqual(response.status_code, 403)

    def test_given_there_is_two_items_in_db_when_item_is_updated_with_invalid_token_then_status_code_is_403(self):
        update = '{"sold":true}'
        response = self.app.put('todo/api/v1.0/items/2',
                                data=update,
                                content_type='application/json',
                                headers={'Authorization':
                                         'Bearer ' + self.invalid_token})
        self.assertEqual(response.status_code, 403)

    def test_given_there_is_two_items_in_db_when_item_is_deleted_with_invalid_token_then_status_code_is_403(self):
        response = self.app.delete('todo/api/v1.0/items/2',
                                   content_type='application/json',
                                   headers={'Authorization':
                                            'Bearer ' + self.invalid_token})
        self.assertEqual(response.status_code, 403)
