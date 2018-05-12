upload_folder = './static/images/'
static_folder = '/static/'

testing_folder = './unit_tests/'
test_data_folder = '/tests/test_data'


class Config(object):
    DEBUG = False
    TESTING = False


class ProductionConfig(Config):
    SECRET_KEY = 'Y\xbf\xb9\xb6\x9e\xca\xf0\tM\x08\x96\x17\xa1t\x90h\xaf\x92\xca1\xde\xcff\xf0'
    ENCRYPTION_ROUNDS = 12
    UPLOAD_FOLDER = upload_folder
    STATIC_FOLDER = static_folder


class DevelopmentConfig(Config):
    DEBUG = True
    SECRET_KEY = 'Y\xbf\xb9\xb6\x9e\xca\xf0\tM\x08\x96\x17\xa1t\x90h\xaf\x92\xca1\xde\xcff\xf0'
    ENCRYPTION_ROUNDS = 12
    JSONIFY_PRETTYPRINT_REGULAR = False
    UPLOAD_FOLDER = upload_folder
    STATIC_FOLDER = static_folder


class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    SECRET_KEY = 'test_secret_key'
    ENCRYPTION_ROUNDS = 4
    UPLOAD_FOLDER = testing_folder
    STATIC_FOLDER = test_data_folder
