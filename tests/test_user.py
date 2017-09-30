import base64
import unittest

from flask import json

from app import app
from database import TestDB
from User import User


TEST_DB = TestDB()
VALID_CREDENTIALS1 = base64.b64encode(b'mojo:best_password_ever').decode('utf-8')
VALID_CREDENTIALS2 = base64.b64encode(b'kojo:very_good_password').decode('utf-8')
INVALID_CREDENTIALS = base64.b64encode(b'coyote:totally_wrong_pw').decode('utf-8')
NEW_ITEM1 = {'title': 'Almost new pair of socks',
             'price':  2,
             'pictures':
                 {'1': 'IMG_1234.jpeg', '2': 'IMG_2345.jpg'}
             }
NEW_ITEM2 = {'title': 'Great rock n roll album',
             'price': 200,
             'pictures':
                 {'1': 'IMG_100.png',
                  '2': 'IMG_104.png'}
             }
USER = User(email='test_email', password='test_pw')

app.config.from_object('Config.TestingConfig')


class TestUser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        TEST_DB.create_two_users_to_db()

    def setUp(self):
        self.db = TEST_DB
        self.app = app.test_client()
        self.token_for_user_id_0 = USER.encode_auth_token(0).decode('utf-8')
        self.token_for_user_id_1 = USER.encode_auth_token(1).decode('utf-8')

    def tearDown(self):
        self.db.items.remove({})

    def test_given_there_is_two_users_when_user_1_puts_item_to_sell_then_item_has_user_1s_id(self):
        self.assertEquals(self.db.items.count(), 0)
        self.app.post('/todo/api/v1.0/items',
                        data=json.dumps(NEW_ITEM1),
                        content_type='application/json',
                        headers={'Authorization':
                                'Bearer ' + self.token_for_user_id_0})
        self.assertEqual(self.db.items.count(), 1)
        for item in self.db.retrieve_items():  # only one item in db
            self.assertEquals(item['seller_id'], 0)

    def test_given_there_is_two_users_when_user_2_puts_item_to_sell_then_item_has_user_2s_id(self):
        self.assertEquals(self.db.items.count(), 0)
        self.app.post('/todo/api/v1.0/items',
                        data=json.dumps(NEW_ITEM1),
                        content_type='application/json',
                        headers={'Authorization':
                            'Bearer ' + self.token_for_user_id_1})
        self.assertEqual(self.db.items.count(), 1)
        for item in self.db.retrieve_items():  # only one item in db
            self.assertEquals(item['seller_id'], 1)  # id = 1, because user 'kojo' was used to login

    def test_given_user_has_no_items_when_user_creates_two_items_then_users_items_are_retrieved(self):
        self.assertEquals(self.db.items.count(), 0)
        self.create_new_item(NEW_ITEM1, self.token_for_user_id_0)
        self.create_new_item(NEW_ITEM2, self.token_for_user_id_0)
        self.create_new_item(NEW_ITEM1, self.token_for_user_id_1)
        self.create_new_item(NEW_ITEM2, self.token_for_user_id_1)

        items = [item for item in self.db.retrieve_items_with_seller_id(0)]
        self.assertEquals(len(items), 2)
        self.assertEquals(items[0]['title'], 'Almost new pair of socks')
        self.assertEquals(items[1]['title'], 'Great rock n roll album')

    def test_given_user_has_signed_up_when_she_enters_credentials_then_she_can_authenticate(self):
        rv = self.app.get('/todo/api/v1.0/auth',
                            content_type='application/json',
                            headers={'Authorization':
                                     'Basic ' + VALID_CREDENTIALS1})
        self.assertEquals(rv.status_code, 200)

    def test_given_user_has_not_signed_up_when_she_enters_credentials_then_she_can_not_authenticate(self):
        rv = self.app.get('/todo/api/v1.0/auth',
                    content_type='application/json',
                    headers={'Authorization': 'Basic ' + INVALID_CREDENTIALS})
        self.assertEquals(rv.status_code, 403)

    def create_new_item(self, item, token):
        self.app.post('/todo/api/v1.0/items',
                      data=json.dumps(item),
                      content_type='application/json',
                      headers={'Authorization': 'Bearer ' + token})

    def test_given_when_user_has_no_items_in_db_when_user1_creates_item_then_user2_cannot_modify_that_item(self):
        self.create_new_item(NEW_ITEM1, VALID_CREDENTIALS1)
        update = {'sold': True}
        response = self.app.put('todo/api/v1.0/items/0',
                                data=json.dumps(update),
                                content_type='application/json',
                                headers={'Authorization': 'Basic ' + VALID_CREDENTIALS2})
        self.assertEqual(response.status_code, 403)




