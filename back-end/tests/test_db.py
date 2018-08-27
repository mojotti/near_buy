import unittest

from app import app
from database import TestDB
from User import User
from samples import items

ITEM1 = items.DB_ITEM1
ITEM2 = items.DB_ITEM2
ITEM3 = items.DB_ITEM3

TEST_PASSWORD = "test_password123"
TEST_USER = "test_user"
TEST_EMAIL = "test_email"
TEST_DB = TestDB()

app.config.from_object('Config.TestingConfig')


class TestApp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        TEST_DB.users.delete_many({})
        TEST_DB.chats.delete_many({})

    def setUp(self):
        self.app = app.test_client()
        self.db = TEST_DB
        self.db.items.insert_one(ITEM1)
        self.db.items.insert_one(ITEM2)
        self.user = User(email='test_email', password='test_pw')

    def tearDown(self):
        self.db.items.delete_many({})
        self.db.users.delete_many({})

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
            'longitude': '-121.45356',
            'latitude': '24.5114392',
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
        self.db.create_new_user_to_database(TEST_EMAIL, TEST_USER, TEST_PASSWORD)
        self.assertTrue(self.db.is_valid_hash_for_user(TEST_USER, TEST_PASSWORD))

    def test_given_there_is_no_users_in_db_when_user_is_created_with_incorrect_pw_then_there_is_no_matching_hash(self):
        self.db.create_new_user_to_database(TEST_EMAIL, TEST_USER, TEST_PASSWORD)
        self.assertFalse(self.db.is_valid_hash_for_user(TEST_USER, "incorrect_password"))

    def test_given_there_is_no_users_in_db_when_new_user_is_created_then_user_is_retrieved_from_db(self):
        self.db.create_new_user_to_database(TEST_EMAIL, TEST_USER, TEST_PASSWORD)
        user = self.db.retrieve_user_by_username(TEST_USER)
        self.assertEqual(user['username'], TEST_USER)

    def test_given_there_is_no_users_in_db_when_user_is_created_twice_then_user_is_not_created_on_second_time(self):
        self.db.create_new_user_to_database(TEST_EMAIL, TEST_USER, TEST_PASSWORD)
        self.db.create_new_user_to_database(TEST_EMAIL, TEST_USER, TEST_PASSWORD)
        self.assertEqual(self.db.users.count(), 1)

    def test_given_there_is_no_users_in_db_when_five_users_are_created_and_four_removed_then_one_user_in_db(self):
        for i in range(5):
            self.db.create_new_user_to_database(TEST_EMAIL + str(i),
                                                'user' + str(i),
                                                'password' + str(i))
        self.assertEqual(self.db.users.count(), 5)
        for i in range(4):
            self.db.remove_user_from_db('user' + str(i))
        self.assertEqual(self.db.users.count(), 1)

    def test_given_there_are_no_users_when_five_users_are_created_then_they_all_can_be_found(self):
        for i in range(5):
            self.db.create_new_user_to_database(TEST_EMAIL + str(i),
                                                'user' + str(i),
                                                'password' + str(i))
        self.assertEqual(self.db.users.count(), 5)
        users = []
        expected = ['user0', 'user1', 'user2', 'user3', 'user4']
        for user in self.db.retrieve_users():
            users.append(user['username'])
        self.assertEqual(users, expected)

    def test_given_there_is_user_in_db_when_user_is_retrieved_then_password_is_hashed(self):
        self.db.create_new_user_to_database(TEST_EMAIL, 'user', 'password')
        user = self.db.retrieve_user_by_username('user')
        self.assertEqual(user['username'], 'user')
        self.assertNotEqual(user['hash'], 'password')
        self.assertTrue('password' not in user and 'hash' in user)

    def test_given_user_exists_in_db_when_token_is_created_then_it_is_attached_to_user_details(self):
        self.db.create_new_user_to_database(TEST_EMAIL, 'user', 'password')
        token = self.user.encode_auth_token(user_id=0)
        self.db.attach_token_to_user(username='user', token=token)
        user_info = self.db.retrieve_user_by_username('user')
        self.assertEqual(token, user_info['token'])
        self.assertEqual('user', user_info['username'])
        decoded_token = self.user.decode_auth_token(user_info['token'])
        self.assertEqual(0, decoded_token)

    def test_given_does_not_exist_in_db_when_token_is_created_then_it_is_not_attached_to_user_details(self):
        token = self.user.encode_auth_token(user_id=0)
        self.db.attach_token_to_user(username='user', token=token)
        user_info = self.db.retrieve_user_by_username('user')
        self.assertEqual(user_info, None)
        all_users = self.db.retrieve_users()
        for user in all_users:
            self.assertEqual(user, None)

    def test_given_user_exists_when_user_is_searched_by_token_then_user_is_retrieved(self):
        self.db.create_new_user_to_database(TEST_EMAIL, 'user', 'password')
        token = self.user.encode_auth_token(user_id=0)
        self.db.attach_token_to_user(username='user', token=token)
        user = self.db.retrieve_user_by_token(token=token)
        self.assertEqual(user['username'], 'user')
        self.assertEqual(user['token'], token)

    def test_given_other_users_have_items_when_they_are_searched_then_they_are_retrieved(self):
        own_seller_id = ITEM3.get('seller_id')
        self.db.items.insert_one(ITEM3)

        other_items = self.db.retrieve_items_from_others(own_seller_id)
        other_items = [item for item in other_items]
        all_items = self.db.retrieve_items()
        all_items = [item for item in all_items]

        self.assertEqual(len(other_items), 2)
        self.assertEqual(len(all_items), 3)

        own_item_in_others = next((item for item in other_items if item["seller_id"] is own_seller_id), None)
        self.assertIsNone(own_item_in_others)

    def test_given_chat_is_created_it_can_be_found(self):
        TEST_DB.chats.delete_many({})

        buying_user = item_id = 0
        selling_user = 1
        title = 'foo'

        self.db.create_a_new_chat_for_item(buying_user, selling_user, item_id, title)
        self.db.create_a_new_chat_for_item(500, selling_user, item_id, title)
        self.db.create_a_new_chat_for_item(100, 500, 3, title)  # add a couple of random chats
        self.db.create_a_new_chat_for_item(buying_user, 500, 3, title)  # add a couple of random chats

        chats = self.db.get_all_chats_for_user(selling_user)

        chats = [self.assertEquals(chat['seller_id'], selling_user) for chat in chats]
        self.assertEquals(len(chats), 2)

    def test_given_chat_exists_when_searched_then_it_is_found(self):
        TEST_DB.chats.delete_many({})

        buying_user = item_id = 0
        selling_user = 1
        title = 'foo'

        is_existing = self.db.is_existing_chat(buying_user, selling_user, item_id)
        self.assertFalse(is_existing)

        self.db.create_a_new_chat_for_item(buying_user, selling_user, item_id, title)

        is_existing = self.db.is_existing_chat(buying_user, selling_user, item_id)
        self.assertTrue(is_existing)







