import base64
import json
import unittest
from app import app
from database import TestDB

ITEM1 = {
    'id': 1,
    'title': u'Nike Shoes AirMax',
    'seller_id': 12345,
    'price': 15,
    'description': u'Hardly used air maxes. Get em while you can',
    'sold': False,
    'location': '-121.45356 46.51119 4392'
    }
ITEM2 = {
    'id': 2,
    'title': u'MacBook Air mid 2012',
    'seller_id': 23456,
    'price': 600,
    'description': u'Killer Mac for serious use. You will love it.',
    'sold': False,
    'location': '-121.45356 46.51119 4392'
    }

TEST_DB = TestDB()


class TestApp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        TEST_DB.create_two_users_to_db()

    @classmethod
    def tearDownClass(cls):
        TEST_DB.remove_all_users_from_db()

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.valid_credentials = base64.b64encode(b'mojo:python').decode('utf-8')
        self.invalid_credentials = base64.b64encode(b'hopo:python').decode('utf-8')  # invalid username
        self.new_item = '{"title":"Almost new pair of socks", "seller_id": 12345, "price": 2, ' \
                        '"pictures": {"1": "IMG_1234.jpeg", "2": "IMG_2345.jpg"}}'
        self.db = TEST_DB
        self.db.items.insert(ITEM1)
        self.db.items.insert(ITEM2)

    def tearDown(self):
        self.db.items.remove({})

    def test_check_item_2_is_not_sold(self):
        response = self.app.get(
            '/todo/api/v1.0/items/2', headers={'Authorization': 'Basic ' + self.valid_credentials})
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertFalse(json_resp['item']['sold'])

    def test_when_new_item_is_created_status_code_is_201(self):
        response = self.app.post('/todo/api/v1.0/items',
                                 data=self.new_item,
                                 content_type='application/json',
                                 headers={'Authorization': 'Basic ' + self.valid_credentials})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.db.items.count(), 3)

    def test_when_new_item_is_created_it_can_be_retrieved(self):
        response = self.app.post('/todo/api/v1.0/items',
                                 data=self.new_item,
                                 content_type='application/json',
                                 headers={'Authorization': 'Basic ' + self.valid_credentials})
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEqual(json_resp['item']['title'], 'Almost new pair of socks')
        self.assertEqual(json_resp['item']['price'], 2)
        self.assertEqual(self.db.items.count(), 3)

    def test_when_non_existing_item_is_requested_status_code_is_404(self):
        response = self.app.get(
            '/todo/api/v1.0/items/5', headers={'Authorization': 'Basic ' + self.valid_credentials})
        self.assertEqual(response.status_code, 404)

    def test_when_item_is_deleted_it_cannot_be_found(self):
        self.app.delete(
            '/todo/api/v1.0/items/1', headers={'Authorization': 'Basic ' + self.valid_credentials})
        response = self.app.get(
            '/todo/api/v1.0/items/1', headers={'Authorization': 'Basic ' + self.valid_credentials})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(self.db.retrieve_item_with_id(1), None)
        self.assertEqual(self.db.items.count(), 1)

    def test_when_new_item_is_created_without_title_status_code_is_400(self):
        item = '{"description":"fake_news"}'
        response = self.app.post('/todo/api/v1.0/items',
                                 data=item,
                                 content_type='application/json',
                                 headers={'Authorization': 'Basic ' + self.valid_credentials})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.db.items.count(), 2)

if __name__ == '__main__':
    unittest.main()
