import base64
import unittest
import jwt

from app import app
from database import TestDB
from User import User

TEST_DB = TestDB()
VALID_CREDENTIALS1 = base64.b64encode(b'mojo:best_password_ever').decode('utf-8')
VALID_CREDENTIALS2 = base64.b64encode(b'kojo:very_good_password').decode('utf-8')
INVALID_CREDENTIALS = base64.b64encode(b'coyote:totally_wrong_pw').decode('utf-8')
NEW_ITEM1 = {'title': 'Almost new pair of socks',
             'price':  2,
             'pictures':
                 {'1': 'IMG_1234.jpeg', '2': 'IMG_2345.jpg'}
             }
NEW_ITEM2 = {'title': 'Great rock n roll album',
             'price': 200,
             'pictures':
                 {'1': 'IMG_100.png',
                  '2': 'IMG_104.png'}
             }

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
