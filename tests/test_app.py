import base64
import json
import unittest
from app import app
from database import TestDB

ITEM1 = {
    'title': u'Nike Shoes AirMax',
    'price': 15,
    'description': u'Hardly used air maxes. Get em while you can',
    'sold': False,
    'location': '-121.45356 46.51119 4392'
    }
ITEM2 = {
    'title': u'MacBook Air mid 2012',
    'price': 600,
    'description': u'Killer Mac for serious use. You will love it.',
    'sold': False,
    'location': '-121.45356 46.51119 4392'
    }

NEW_ITEM = {
    'title': 'Almost new pair of socks',
    'price': 2,
    'pictures':
    {'1': 'IMG_1234.jpeg',
     '2': 'IMG_2345.jpg'}
    }

VALID_CREDENTIALS = base64.b64encode(b'mojo:best_password_ever').decode('utf-8')
TEST_DB = TestDB()

app.config.from_object('Config.TestingConfig')


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

    def create_two_items(self):
        self.app.post('/todo/api/v1.0/items',
                      data=json.dumps(ITEM1),
                      content_type='application/json',
                      headers={'Authorization': 'Basic ' + VALID_CREDENTIALS})
        self.app.post('/todo/api/v1.0/items',
                      data=json.dumps(ITEM2),
                      content_type='application/json',
                      headers={'Authorization': 'Basic ' + VALID_CREDENTIALS})

    def test_given_there_is_two_items_in_db_when_item_two_is_retrieved_then_it_is_not_sold(self):
        response = self.app.get('/todo/api/v1.0/items/1',
                                headers={'Authorization': 'Basic ' + VALID_CREDENTIALS})
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertFalse(json_resp['item']['sold'])

    def test_given_there_is_two_items_in_db_when_new_items_is_added_then_status_code_is_201(self):
        response = self.app.post('/todo/api/v1.0/items',
                                 data=json.dumps(NEW_ITEM),
                                 content_type='application/json',
                                 headers={'Authorization': 'Basic ' + VALID_CREDENTIALS})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.db.items.count(), 3)

    def test_given_there_is_two_items_in_db_when_new_item_is_created_then_it_can_be_retrieved(self):
        response = self.app.post('/todo/api/v1.0/items',
                                 data=json.dumps(NEW_ITEM),
                                 content_type='application/json',
                                 headers={'Authorization': 'Basic ' + VALID_CREDENTIALS})
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertEqual(json_resp['item']['title'], 'Almost new pair of socks')
        self.assertEqual(json_resp['item']['price'], 2)
        self.assertEqual(json_resp['item']['seller_id'], 0)  # user 'mojo' was used to login
        self.assertEqual(self.db.items.count(), 3)

    def test_given_there_is_two_items_in_db_when_item_number_five_is_requested_then_it_can_not_be_retrieved(self):
        response = self.app.get(
            '/todo/api/v1.0/items/5', headers={'Authorization': 'Basic ' + VALID_CREDENTIALS})
        self.assertEqual(response.status_code, 404)

    def test_given_there_is_two_items_in_db_when_item_number_one_is_deleted_it_cannot_be_found(self):
        self.app.delete(
            '/todo/api/v1.0/items/1', headers={'Authorization': 'Basic ' + VALID_CREDENTIALS})
        response = self.app.get(
            '/todo/api/v1.0/items/1', headers={'Authorization': 'Basic ' + VALID_CREDENTIALS})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(self.db.retrieve_item_with_id(1), None)
        self.assertEqual(self.db.items.count(), 1)

    def test_given_there_is_two_items_in_db_when_invalid_item_is_created_then_status_code_400_is_retrieved(self):
        item = {'description': 'fake_news'}  # no title or price
        response = self.app.post('/todo/api/v1.0/items',
                                 data=json.dumps(item),
                                 content_type='application/json',
                                 headers={'Authorization': 'Basic ' + VALID_CREDENTIALS})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.db.items.count(), 2)

