"""
All database related methods are in DatabaseHelper() class.
"""
import app as near_buy
import bcrypt
from pymongo import MongoClient
from pymongo import errors


class DatabaseHelper(object):
    def __init__(self):
        try:
            self.client = MongoClient()
            self.db = self.client.production
            self.items = self.db.items
            self.users = self.db.users
        except errors.ServerSelectionTimeoutError as err:
            print(err)

    def retrieve_items(self):
        return self.items.find({}, {'_id': 0})

    def retrieve_item_with_title(self, title):
        return self.items.find_one({'title': title}, {'_id': 0})

    def retrieve_item_with_id(self, id_):
        return self.items.find_one({'id': id_}, {'_id': 0})

    def retrieve_items_with_seller_id(self, id_):
        return self.items.find({'seller_id': id_}, {'_id': 0})

    def find_and_update_item(self, item):
        id_ = item['id']
        items = self.retrieve_items()
        try:
            item_to_change = next(item for item in items if item['id'] == id_)
            self._update_item(id_, item, item_to_change)
        except:
            raise ValueError("Task was not updated")

    def _update_item(self, id_, item, item_to_change):
        for key, value in item_to_change.items():
            for k, new_value in item.items():
                if key == k and value != new_value:
                    self.items.update({'id': id_}, {'$set': {key: new_value}})

    def remove_item(self, item):
        id_ = item['id']
        item_to_remove = self.retrieve_item_with_id(id_)
        if item_to_remove == item:
            self.items.remove({'id': id_})
        else:
            raise ValueError("Task was not found!")

    def remove_item_by_id(self, id_):
        self.items.remove({'id': id_})

    def add_item_to_db(self, item):
        self.items.insert_one(item)

    def insert_user_to_db(self, user_info):
        self.users.insert_one(user_info)

    def remove_user_from_db(self, username):
        self.users.remove({'username': username})

    def retrieve_users(self):
        return self.users.find({}, {'_id': 0})

    def retrieve_user_by_username(self, username):
        return self.users.find_one({'username': username}, {'_id': 0})

    def retrieve_user_id_with_username(self, username):
        user = self.users.find_one({'username': username}, {'_id': 0})
        return user['id']

    def is_username_or_email_taken(self, email, username):
        user_found_by_email = self.users.find_one({'email': email})
        if user_found_by_email:
            return True
        user_found_by_username = self.users.find_one({'username': username})
        if user_found_by_username:
            return True
        return False

    def create_new_user_to_database(self, email, username, password):
        hash_ = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(near_buy.app.config['ENCRYPTION_ROUNDS']))
        user_id = self.get_user_id()
        user_info = {'email': email,
                     'username': username,
                     'hash': hash_,
                     'id': user_id}
        is_existing_user = self.is_username_or_email_taken(email,
                                                           username)
        if not is_existing_user:
            self.insert_user_to_db(user_info)
        else:
            return "user exists already"

    def is_valid_hash_for_user(self, username, password):
        try:
            user = next(user for user in self.users.find({}, {'_id': 0}) if user['username'] == username)
            return bcrypt.checkpw(password.encode('utf-8'), user['hash'])
        except StopIteration:
            return False

    def attach_token_to_user(self, username, token):
        self.users.update_one({'username': username},
                          {'$set': {'token': token}}, upsert=False)

    def retrieve_user_by_token(self, token):
        return self.users.find_one({'token': token}, {'_id': 0})

    def get_user_id(self):
        item = self.users.find_one(sort=[("id", -1)])
        return item['id']+1 if item else 0

    def get_item_id(self):
        item = self.items.find_one(sort=[("id", -1)])
        return item['id']+1 if item else 0


class TestDB(DatabaseHelper):
    def __init__(self):
        try:
            self.client = MongoClient()
            self.db = self.client.test
            self.items = self.db.items
            self.users = self.db.users
        except errors.ServerSelectionTimeoutError as err:
            print(err)

    def create_two_users_to_db(self):
        self.create_new_user_to_database('test_email', 'mojo', 'best_password_ever')
        self.create_new_user_to_database('test_email_2', 'kojo', 'very_good_password')
