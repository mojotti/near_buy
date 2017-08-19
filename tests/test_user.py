import base64
import unittest
from app import app
from database import TestDB

TEST_DB = TestDB()


class TestUser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        TEST_DB.create_two_users_to_db()

    def setUp(self):
        self.db = TEST_DB
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.valid_credentials1 = base64.b64encode(b'mojo:best_password_ever').decode('utf-8')
        self.valid_credentials2 = base64.b64encode(b'kojo:very_good_password').decode('utf-8')
        self.new_item = '{"title":"Almost new pair of socks", "price": 2, ' \
                        '"pictures": {"1": "IMG_1234.jpeg", "2": "IMG_2345.jpg"}}'
        self.new_item2 = '{"title":"Great rock n roll album", "price": 200, ' \
                        '"pictures": {"1": "IMG_100.png", "2": "IMG_104.png"}}'

    def tearDown(self):
        self.db.items.remove({})

    def test_given_there_is_two_users_when_user_1_puts_item_to_sell_then_item_has_user_1s_id(self):
        self.assertEquals(self.db.items.count(), 0)
        self.app.post('/todo/api/v1.0/items',
                                 data=self.new_item,
                                 content_type='application/json',
                                 headers={'Authorization': 'Basic ' + self.valid_credentials1})
        self.assertEqual(self.db.items.count(), 1)
        for item in self.db.retrieve_items():  # only one item in db
            self.assertEquals(item['seller_id'], 0)  # id = 0, because user 'mojo' was used to login

    def test_given_there_is_two_users_when_user_2_puts_item_to_sell_then_item_has_user_2s_id(self):
        self.assertEquals(self.db.items.count(), 0)
        self.app.post('/todo/api/v1.0/items',
                                 data=self.new_item,
                                 content_type='application/json',
                                 headers={'Authorization': 'Basic ' + self.valid_credentials2})
        self.assertEqual(self.db.items.count(), 1)
        for item in self.db.retrieve_items():  # only one item in db
            self.assertEquals(item['seller_id'], 1)  # id = 1, because user 'kojo' was used to login

    def test_given_user_has_no_items_when_user_creates_two_items_then_users_items_are_retrieved(self):
        self.assertEquals(self.db.items.count(), 0)
        self.create_new_item(self.new_item, self.valid_credentials1)
        self.create_new_item(self.new_item2, self.valid_credentials1)
        self.create_new_item(self.new_item, self.valid_credentials2)
        self.create_new_item(self.new_item2, self.valid_credentials2)

        items = [item for item in self.db.retrieve_items_with_seller_id(0)]
        self.assertEquals(len(items), 2)
        self.assertEquals(items[0]['title'], 'Almost new pair of socks')
        self.assertEquals(items[1]['title'], 'Great rock n roll album')

    def create_new_item(self, item, credentials):
        self.app.post('/todo/api/v1.0/items',
                      data=item,
                      content_type='application/json',
                      headers={'Authorization': 'Basic ' + credentials})


