import unittest

from app import app
from database import TestDB
from User import User

TEST_DB = TestDB()

app.config.from_object('Config.TestingConfig')


class TestUser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        TEST_DB.create_two_users_to_db()

    def setUp(self):
        self.db = TEST_DB
        self.app = app.test_client()
        self.user = User(
                    email='test_user',
                    password='test_pw'
                    )

    def test_given_there_is_config_file_when_test_is_run_then_app_is_testing(self):
        self.assertTrue(app.config['SECRET_KEY'] is 'test_secret_key')
        self.assertTrue(app.config['DEBUG'])
        self.assertTrue(app.config['TESTING'])

    def test_given_user_exists_when_token_is_created_then_token_is_encoded(self):
        auth_token = self.user.encode_auth_token(112)
        self.assertTrue(isinstance(auth_token, bytes))

    def test_given_user_exists_when_token_is_decoded_then_it_retrieves_correct_user_id(self):
        auth_token = self.user.encode_auth_token(666)
        self.assertTrue(isinstance(auth_token, bytes))
        self.assertEquals(User.decode_auth_token(auth_token), 666)

    def test_given_user_exists_when_invalid_token_is_decoded_then_error_is_retrieved(self):
        invalid_token = 'lol_lol_omg_i_am_not_token_and_i_should_be_decoded_now'
        self.assertTrue(User.decode_auth_token(invalid_token),
                        'Invalid token. Please log in again.')
