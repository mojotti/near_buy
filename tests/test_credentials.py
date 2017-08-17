import base64
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

test_db = TestDB()


class TestLogin(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        test_db.create_test_users_to_test_db()
        test_db.items.insert(ITEM1)
        test_db.items.insert(ITEM2)

    @classmethod
    def tearDownClass(cls):
        test_db.remove_test_users_from_db()
        test_db.items.remove({})

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.valid_credentials = base64.b64encode(b'mojo:python').decode('utf-8')
        self.invalid_password = base64.b64encode(b'fake:python').decode('utf-8')
        self.invalid_username = base64.b64encode(b'mojo:fake').decode('utf-8')
        self.new_item = '{"title":"Read a book"}'

    def test_item_2_can_be_retrieved_when_correct_credentials_are_entered(self):
        response = self.app.get(
            '/todo/api/v1.0/items/2', headers={'Authorization': 'Basic ' + self.valid_credentials})
        self.assertEqual(response.status, '200 OK')

    def test_when_invalid_password_is_entered_item_2_is_not_retrieved(self):
        response = self.app.get(
            '/todo/api/v1.0/items/2', headers={'Authorization': 'Basic ' + self.invalid_password})
        self.assertEqual(response.status, '403 FORBIDDEN')

    def test_when_invalid_username_is_entered_item_2_is_not_retrieved(self):
        response = self.app.get(
            '/todo/api/v1.0/items/2', headers={'Authorization': 'Basic ' + self.invalid_username})
        self.assertEqual(response.status, '403 FORBIDDEN')

    def test_all_items_are_retrieved_when_correct_credentials_are_entered(self):
        response = self.app.get(
            'todo/api/v1.0/items', headers={'Authorization': 'Basic ' + self.valid_credentials})
        self.assertEqual(response.status, '200 OK')

    def test_when_invalid_password_is_entered_items_are_not_retrieved(self):
        response = self.app.get(
            '/todo/api/v1.0/items', headers={'Authorization': 'Basic ' + self.invalid_password})
        self.assertEqual(response.status, '403 FORBIDDEN')

    def test_when_invalid_username_is_entered_items_are_not_retrieved(self):
        response = self.app.get(
            '/todo/api/v1.0/items/2', headers={'Authorization': 'Basic ' + self.invalid_username})
        self.assertEqual(response.status, '403 FORBIDDEN')

    def test_when_new_item_is_created_without_credentials_status_code_is_403(self):
        response = self.app.post('todo/api/v1.0/items',
                                 data=self.new_item,
                                 content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_when_new_item_is_created_with_wrong_credentials_status_code_is_403(self):
        response = self.app.post('todo/api/v1.0/items',
                                 data=self.new_item,
                                 content_type='application/json',
                                 headers={'Authorization': 'Basic ' + self.invalid_password})
        self.assertEqual(response.status_code, 403)

    def test_when_item_is_updated_with_wrong_password_status_code_is_403(self):
        update = '{"sold":true}'
        response = self.app.put('todo/api/v1.0/items/2',
                                data=update,
                                content_type='application/json',
                                headers={'Authorization': 'Basic ' + self.invalid_password})
        self.assertEqual(response.status_code, 403)

    def test_when_item_is_deleted_with_invalid_credentials_status_code_is_403(self):
        response = self.app.delete('todo/api/v1.0/items/2',
                                   content_type='application/json',
                                   headers={'Authorization': 'Basic ' + self.invalid_password})
        self.assertEqual(response.status_code, 403)