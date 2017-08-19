import base64
import json
import unittest
from app import app
from database import TestDB

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
        self.valid_credentials = base64.b64encode(b'mojo:best_password_ever').decode('utf-8')
        self.db = TEST_DB
        self.db.items.insert(ITEM1)
        self.db.items.insert(ITEM2)

    def tearDown(self):
        self.db.items.remove({})

    def test_when_item_is_updated_it_is_changed(self):
        update = '{"sold":true}'
        response = self.app.put('todo/api/v1.0/items/2',
                                data=update,
                                content_type='application/json',
                                headers={'Authorization': 'Basic ' + self.valid_credentials})
        json_resp = json.loads(response.data.decode('utf-8'))
        self.assertTrue(json_resp['item']['sold'])
        item_in_db = self.db.retrieve_item_with_title(u'MacBook Air mid 2012')
        self.assertTrue(item_in_db['sold'])

    def test_when_item_update_is_not_in_json_error_code_400_is_retrieved(self):
        update = '{"sold": true}'
        response = self.app.put('todo/api/v1.0/items/2',
                                data=update,
                                headers={'Authorization': 'Basic ' + self.valid_credentials})
        self.assertEqual(response.status_code, 400)

    def test_when_item_update_title_is_not_string_code_error_code_400_is_retrieved(self):
        update = '{"title": 111}'
        response = self.app.put('todo/api/v1.0/items/2',
                                data=update,
                                content_type='application/json',
                                headers={'Authorization': 'Basic ' + self.valid_credentials})
        self.assertEqual(response.status_code, 400)

    def test_when_item_update_description_is_not_string_code_error_code_400_is_retrieved(self):
        update = '{"description": 1234456789}'
        response = self.app.put('todo/api/v1.0/items/2',
                                data=update,
                                content_type='application/json',
                                headers={'Authorization': 'Basic ' + self.valid_credentials})
        self.assertEqual(response.status_code, 400)

    def test_when_item_update_sold_is_not_bool_code_error_code_400_is_retrieved(self):
        update = '{"sold": "not_bool"}'
        response = self.app.put('todo/api/v1.0/items/2',
                                data=update,
                                content_type='application/json',
                                headers={'Authorization': 'Basic ' + self.valid_credentials})
        self.assertEqual(response.status_code, 400)
