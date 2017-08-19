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
        self.valid_credentials1 = base64.b64encode(b'mojo:python').decode('utf-8')
        self.valid_credentials2 = base64.b64encode(b'kojo:python').decode('utf-8')
        self.new_item = '{"title":"Almost new pair of socks", "seller_id": 12345, "price": 2, ' \
                        '"pictures": {"1": "IMG_1234.jpeg", "2": "IMG_2345.jpg"}}'

    def tearDown(self):
        self.db.items.remove({})

    def test_given_there_is_user_when_user_puts_item_to_sell_then_item_has_user_id(self):
        response = self.app.post('/todo/api/v1.0/items',
                                 data=self.new_item,
                                 content_type='application/json',
                                 headers={'Authorization': 'Basic ' + self.valid_credentials2})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.db.items.count(), 1)
        print("users", self.db.users.count())
        items = self.db.retrieve_items()
        for item in items:
            print(item)
