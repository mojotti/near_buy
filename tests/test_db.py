import unittest
from app import app
from database import TestDB

TEST_PASSWORD = "test_password123"
TEST_USER = "test_user"

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


class TestApp(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.db = test_db
        self.db.items.insert(ITEM1)
        self.db.items.insert(ITEM2)

    def tearDown(self):
        self.db.items.remove({})
        self.db.users.remove({})

    def test_when_item_is_updated_it_is_changed_in_db(self):
        old_item = self.db.retrieve_item_with_title('MacBook Air mid 2012')
        item = {
            'id': 2,
            'title': u'SOLD! MacBook Air mid 2012',
            'seller_id': 23456,
            'price': 900,
            'description': u'Price went up. This Mac is sold.',
            'sold': True,
            'location': '46.51119 4392 -121.45356'
            }
        self.db.find_and_update_item(item)
        updated_item = self.db.retrieve_item_with_title('SOLD! MacBook Air mid 2012')
        self.assertEqual(updated_item['id'], 2)
        self.assertEqual(updated_item['sold'], True)
        self.assertEqual(updated_item['price'], 900)
        self.assertEqual(updated_item['description'], 'Price went up. This Mac is sold.')
        self.assertNotEqual(updated_item['sold'], old_item['sold'])

    def test_when_item_to_update_is_not_different_it_is_not_updated(self):
        old_item = self.db.retrieve_item_with_title('Nike Shoes AirMax')
        item = {
            'id': 1,
            'title': u'Nike Shoes AirMax',
            'seller_id': 12345,
            'price': 15,
            'description': u'Hardly used air maxes. Get em while you can',
            'sold': False,
            'location': '-121.45356 46.51119 4392'
            }
        self.db.find_and_update_item(item)
        updated_item = self.db.retrieve_item_with_id(2)
        self.assertEqual(updated_item['sold'], False)
        self.assertEqual(updated_item['sold'], old_item['sold'])

    def test_when_many_fields_of_item_are_updated_all_fields_are_updated(self):
        item = {'id': 2, 'sold': True, 'title': 'I am awesome',
                'description': 'Me hungry'}
        self.db.find_and_update_item(item)
        updated_item = self.db.retrieve_item_with_id(2)
        self.assertEqual(updated_item['sold'], True)
        self.assertEqual(updated_item['title'], 'I am awesome')
        self.assertEqual(updated_item['description'], 'Me hungry')

    def test_when_item_with_invalid_id_is_tried_to_be_updated_error_is_raised(self):
        item = {'id': 6, 'sold': True, 'title': 'I dont exist',
                'description': 'Oh my gosh'}
        self.assertRaises(ValueError, self.db.find_and_update_item, item)

    def test_when_item_is_deleted_it_cannot_be_found(self):
        item = {
            'id': 2,
            'title': u'MacBook Air mid 2012',
            'seller_id': 23456,
            'price': 600,
            'description': u'Killer Mac for serious use. You will love it.',
            'sold': False,
            'location': '-121.45356 46.51119 4392'
            }
        self.db.remove_item(item)
        self.assertEqual(self.db.items.count(), 1)
        self.assertEqual(self.db.retrieve_item_with_id(2), None)

    def test_when_non_existing_item_is_tried_to_be_removed_error_is_risen(self):
        item = {'id': 6, 'sold': True, 'title': 'I dont exist',
                'description': 'Oh my gosh'}
        self.assertRaises(ValueError, self.db.remove_item, item)

    def test_item_is_removed_with_correct_id(self):
        self.db.remove_item_by_id(1)
        self.assertEqual(self.db.retrieve_item_with_id(1), None)
        self.assertEqual(self.db.items.count(), 1)

    def test_matching_hash_is_found_from_db(self):
        self.db.create_new_user_to_database(TEST_USER, TEST_PASSWORD)
        self.assertTrue(self.db.check_password_hash_for_user(TEST_USER, TEST_PASSWORD))

    def test_password_does_not_match_to_hash_in_db(self):
        self.db.create_new_user_to_database(TEST_USER, TEST_PASSWORD)
        self.assertFalse(self.db.check_password_hash_for_user(TEST_USER, "incorrect_password"))

    def test_single_user_is_retrieved_from_db(self):
        self.db.create_new_user_to_database(TEST_USER, TEST_PASSWORD)
        user = self.db.retrieve_user_by_username(TEST_USER)
        self.assertEqual(user['username'], TEST_USER)

    def test_when_user_exists_already_it_is_not_created(self):
        self.db.create_new_user_to_database(TEST_USER, TEST_PASSWORD)
        self.db.create_new_user_to_database(TEST_USER, TEST_PASSWORD)
        self.assertEqual(self.db.users.count(), 1)

    def test_when_five_users_are_created_and_four_users_are_removed_then_one_users_in_db(self):
        for i in range(5):
            self.db.create_new_user_to_database('user' + str(i), 'password' + str(i))
        self.assertEqual(self.db.users.count(), 5)
        for i in range(4):
            self.db.remove_user_from_db('user' + str(i))
        self.assertEquals(self.db.users.count(), 1)

    def test_given_there_are_no_users_when_five_users_are_created_then_they_can_be_found(self):
        for i in range(5):
            self.db.create_new_user_to_database('user' + str(i), 'password' + str(i))
        self.assertEqual(self.db.users.count(), 5)
        users = []
        expected = ['user0', 'user1', 'user2', 'user3', 'user4']
        for user in self.db.retrieve_users():
            users.append(user['username'])
        self.assertEquals(users, expected)

    def test_given_there_is_user_in_db_when_user_is_retrieved_then_password_is_hashed(self):
        self.db.create_new_user_to_database('user', 'password')
        user = self.db.retrieve_user_by_username('user')
        self.assertNotEquals(user['hash'], 'password')
        self.assertTrue('password' not in user and 'hash' in user)






