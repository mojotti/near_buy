import unittest
from app import app
from database import TestDB
from User import User

from samples import items

ITEM1 = items.ITEM1
ITEM2 = items.ITEM2

TEST_PASSWORD = "test_password123"
TEST_USER = "test_user"
TEST_DB = TestDB()

app.config.from_object('Config.TestingConfig')


class TestApp(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.db = TEST_DB
        self.db.items.insert(ITEM1)
        self.db.items.insert(ITEM2)
        self.user = User(email='test_email', password='test_pw')

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

    def test_given_there_is_two_items_in_db_when_item_to_update_is_not_different_then_it_is_not_updated(self):
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

    def test_given_there_is_two_items_in_db_when_many_fields_of_item_are_updated_then_all_fields_are_updated(self):
        item = {'id': 2, 'sold': True, 'title': 'I am awesome',
                'description': 'Me hungry'}
        self.db.find_and_update_item(item)
        updated_item = self.db.retrieve_item_with_id(2)
        self.assertEqual(updated_item['sold'], True)
        self.assertEqual(updated_item['title'], 'I am awesome')
        self.assertEqual(updated_item['description'], 'Me hungry')

    def test_given_there_is_two_items_in_db_when_item_with_invalid_id_is_tried_to_be_updated_then_error_is_raised(self):
        item = {'id': 6, 'sold': True, 'title': 'I dont exist',
                'description': 'Oh my gosh'}
        self.assertRaises(ValueError, self.db.find_and_update_item, item)

    def test_given_there_is_two_items_in_db_when_item_is_deleted_then_it_cannot_be_found(self):
        item = {
            'id': 1,
            'title': u'Nike Shoes AirMax',
            'price': 15,
            'description': u'Hardly used air maxes. Get em while you can',
            'sold': False,
            'location': '-121.45356 46.51119 4392',
            'seller_id': 0
        }
        self.db.remove_item(item)
        self.assertEqual(self.db.items.count(), 1)
        self.assertEqual(self.db.retrieve_item_with_id(1), None)

    def test_given_there_is_two_items_in_db_when_non_existing_item_is_tried_to_be_removed_then_error_is_risen(self):
        item = {'id': 6, 'sold': True, 'title': 'I dont exist',
                'description': 'Oh my gosh'}
        self.assertRaises(ValueError, self.db.remove_item, item)

    def test_given_there_is_two_items_in_db_when_item_is_removed_with_correct_id_then_it_is_removed(self):
        self.db.remove_item_by_id(1)
        self.assertEqual(self.db.retrieve_item_with_id(1), None)
        self.assertEqual(self.db.items.count(), 1)

    def test_given_there_is_no_users_in_db_when_new_user_is_created_then_matching_hash_is_found_from_db(self):
        self.db.create_new_user_to_database(TEST_USER, TEST_PASSWORD)
        self.assertTrue(self.db.check_password_hash_for_user(TEST_USER, TEST_PASSWORD))

    def test_given_there_is_no_users_in_db_when_user_is_created_with_incorrect_pw_then_there_is_no_matching_hash(self):
        self.db.create_new_user_to_database(TEST_USER, TEST_PASSWORD)
        self.assertFalse(self.db.check_password_hash_for_user(TEST_USER, "incorrect_password"))

    def test_given_there_is_no_users_in_db_when_new_user_is_created_then_user_is_retrieved_from_db(self):
        self.db.create_new_user_to_database(TEST_USER, TEST_PASSWORD)
        user = self.db.retrieve_user_by_username(TEST_USER)
        self.assertEqual(user['username'], TEST_USER)

    def test_given_there_is_no_users_in_db_when_user_is_created_twice_then_user_is_not_created_on_second_time(self):
        self.db.create_new_user_to_database(TEST_USER, TEST_PASSWORD)
        self.db.create_new_user_to_database(TEST_USER, TEST_PASSWORD)
        self.assertEqual(self.db.users.count(), 1)

    def test_given_there_is_no_users_in_db_when_five_users_are_created_and_four_removed_then_one_user_in_db(self):
        for i in range(5):
            self.db.create_new_user_to_database('user' + str(i), 'password' + str(i))
        self.assertEqual(self.db.users.count(), 5)
        for i in range(4):
            self.db.remove_user_from_db('user' + str(i))
        self.assertEquals(self.db.users.count(), 1)

    def test_given_there_are_no_users_when_five_users_are_created_then_they_all_can_be_found(self):
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
        self.assertEquals(user['username'], 'user')
        self.assertNotEquals(user['hash'], 'password')
        self.assertTrue('password' not in user and 'hash' in user)

    def test_given_user_exists_in_db_when_token_is_created_it_is_attached_to_user_details(self):
        self.db.create_new_user_to_database('user', 'password')
        token = self.user.encode_auth_token(user_id=0)
        self.db.attach_token_to_user(username='user', token=token)
        user_info = self.db.retrieve_user_by_username('user')
        self.assertEquals(token, user_info['token'])
        self.assertEquals('user', user_info['username'])
        decoded_token = self.user.decode_auth_token(user_info['token'])
        self.assertEquals(0, decoded_token)

    def test_given_when_user_exists_when_user_is_searched_by_token_then_user_is_retrieved(self):
        self.db.create_new_user_to_database('user', 'password')
        token = self.user.encode_auth_token(user_id=0)
        self.db.attach_token_to_user(username='user', token=token)
        user = self.db.retrieve_user_by_token(token=token)
        self.assertEquals(user['username'], 'user')
        self.assertEquals(user['token'], token)









