"""
'app.py' provides a RESTful API for NearBuy app.
"""
import ast
import base64
import imghdr
import os
import sys
import six
from flask import Flask, jsonify, abort, request, make_response, url_for, g
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth

import User as U
import database
from werkzeug.utils import secure_filename

app = Flask(__name__, static_url_path="")
app.config.from_object('Config.DevelopmentConfig')

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth('Bearer')

if sys.argv[0] == 'app.py':
    DB = database.DatabaseHelper()
else:
    DB = database.TestDB()  # if running unit tests

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'pbm', 'bmp'])


@token_auth.verify_token
def verify_token(token):
    """
    If token matches with the one stored in DB, verifying is successful.
    :param: token
    :return: bool
    """
    user = DB.retrieve_user_by_token(token)
    if not user:
        return False
    g.user = user
    return token == user['token']


@app.route('/api/v1.0/auth', methods=['GET'])
@basic_auth.login_required
def validate_user_and_update_token_to_db():
    """
    Get user id from db, initialize User object, create token
    & and attach created token to user's details in db. Finally
    return username and token as jwt-token.
    :return: json
    """
    user_data = DB.retrieve_user_by_username(g.username)
    user = U.User(email=g.username, password=g.password)
    token = user.encode_auth_token(user_id=user_data['id'])
    DB.attach_token_to_user(username=g.username, token=token.decode('utf-8'))
    return jsonify({'username': g.username,
                    'token': token.decode('utf-8')})


@basic_auth.verify_password
def verify_password(username, password):
    """
    Verify that hash is found for username & password.
    :param: username, password
    :return: bool
    """
    g.username, g.password = username, password
    return DB.is_valid_hash_for_user(username, password)


@token_auth.error_handler
def unauthorized():
    """For token_auth. Return 403 instead of 401 to prevent browsers from displaying the default auth dialog."""
    return make_response(jsonify({'error': 'Unauthorized access'}), 403)


@basic_auth.error_handler
def unauthorized():
    """For basic_auth. Return 403 instead of 401 to prevent browsers from displaying the default auth dialog."""
    return make_response(jsonify({'error': 'Unauthorized access'}), 403)


@app.errorhandler(400)
def bad_request(error):
    """Return error code 400, when bad request is made."""
    return make_response(jsonify({'error': 'Bad request'}), 400)


@app.errorhandler(404)
def not_found(error):
    """Return error code 404, when item is not found."""
    return make_response(jsonify({'error': 'Not found'}), 404)


def make_public_item(item):
    """"
    Helper function for get_items(). Collects one item at the time.
    :param: item
    :return: dictionary
    """
    new_item = {}
    for field in item:
        if field == 'id':
            new_item['uri'] = url_for('get_item', item_id=item['id'],
                                      _external=True)
            new_item['id'] = item[field]
        else:
            new_item[field] = item[field]
    return new_item


@app.route('/api/v1.0/register', methods=['POST'])
def new_user():
    """
    Register new user and save its details to db.
    :return: json
    """
    encoded_msg = request.get_json().get('user_info')
    msg = base64.urlsafe_b64decode(encoded_msg).decode('utf-8').split(':')
    username, email, password = msg[0], msg[1], msg[2]
    if username is '' or email is '' or password is '':
        abort(400)
    db_resp = DB.create_new_user_to_database(email=email, username=username, password=password)
    if db_resp == 'user exists already':
        return jsonify({'user_creation': 'user exists'})
    else:
        return jsonify({'user_creation': 'success'})


@app.route('/api/v1.0/user/items', methods=['GET'])
@token_auth.login_required
def get_items_for_user():
    """
    Get all items that user<id> has.
    :return: json
    """
    items = DB.retrieve_items_with_seller_id(g.user['id'])
    public_items = [make_public_item(item) for item in items]
    if not public_items:
        return jsonify({'items': 'no items'})
    return jsonify({'items': public_items})


@app.route('/api/v1.0/items', methods=['GET'])
@token_auth.login_required
def get_items():
    """
    Get all items.
    :return: json
    """
    items = DB.retrieve_items()
    return jsonify({'items': [make_public_item(item) for item in items]})


@app.route('/api/v1.0/items/<int:item_id>', methods=['GET'])
@token_auth.login_required
def get_item(item_id):
    """
    Get one item with id.
    :param: item_id
    :return: json
    """
    items = DB.retrieve_items()
    item = [item for item in items if item['id'] == item_id]
    item_length = len(item)
    if item_length == 0:
        abort(404)
    return jsonify({'item': make_public_item(item[0])})


@app.route('/api/v1.0/items', methods=['POST'])
@token_auth.login_required
def create_item():
    """
    Create new item and add it to database.
    Save pictures to file system, if there are pictures with item.
    :return: json, status code
    """
    user_data = ast.literal_eval(request.form['info'])
    pictures = request.files.getlist('pictures[]')
    if pictures:
        save_pictures(pictures)
    if not user_data or 'title' not in user_data or 'price' not in user_data:
        abort(400)
    item = get_item_details(user_data)
    DB.add_item_to_db(item)
    item = DB.retrieve_item_with_title(user_data.get('title'))
    return jsonify({'item': make_public_item(item)}), 201


def is_allowed_file(picture):
    """
     Helper for create_item().
     Check if file to be saved is in allowed format.
     :param: filename
     """
    is_valid_image = imghdr.what(picture) in ALLOWED_EXTENSIONS
    return '.' in picture.filename and is_valid_image


def save_pictures(pictures):
    """
    Helper for create_item().
    Save item's pictures to file system.
    :param: pictures
    """
    for picture in pictures:
        if is_allowed_file(picture):
            picture_name = secure_filename(picture.filename)
            id_ = DB.get_id_for_new_item()
            directory = app.config['UPLOAD_FOLDER'] + str(id_) + '/'
            if not os.path.exists(directory):
                os.makedirs(directory)
            picture.save(os.path.join(directory + picture_name))


def get_item_details(user_data):
    """
    Helper for create_item().
    Get and return all necessary details for item.
    :param: user_data
    :return: dictionary
    """
    user_id = g.user['id']
    return {
        'id': DB.get_id_for_new_item(),
        'title': user_data.get('title'),
        'price': int(user_data.get('price')),
        'seller_id': user_id,
        'description': user_data.get('description'),
        'sold': False,
        'latitude': user_data.get('latitude'),
        'longitude': user_data.get('longitude')
    }


@app.route('/api/v1.0/items/<int:item_id>', methods=['PUT'])
@token_auth.login_required
def update_item(item_id):
    """
    Update one item with id.
    :param: item_id
    :return: json
    """
    user_id = g.user['id']
    items = DB.retrieve_items()
    item = [item for item in items if item['id'] == item_id]
    if item[0].get('seller_id') != user_id:  # prevent modifying another user's items
        abort(403)
    check_if_item_is_valid(item)
    item[0]['title'] = request.get_json().get('title', item[0]['title'])
    item[0]['description'] = request.get_json().get('description',
                                              item[0]['description'])
    item[0]['seller_id'] = user_id
    item[0]['sold'] = request.get_json().get('sold', item[0]['sold'])
    item[0]['location'] = request.get_json().get('location', item[0]['location'])
    DB.find_and_update_item(item[0])
    return jsonify({'item': make_public_item(item[0])})


def check_if_item_is_valid(item):
    """
    Helper for update_item()
    Check if all necessary conditions are fulfilled for item.
    :param: item
    """
    item_length = len(item)
    if item_length == 0:
        abort(404)
    if not request.get_json():
        abort(400)
    if 'title' in request.get_json() and \
            not isinstance(request.get_json()['title'], six.string_types):
        abort(400)
    if 'price' in request.get_json() and \
            not isinstance(request.get_json()['price'], int):
        abort(400)
    if 'description' in request.get_json() and \
            not isinstance(request.get_json()['description'], six.string_types):
        abort(400)
    if 'sold' in request.get_json() and not isinstance(request.get_json()['sold'], bool):
        abort(400)
    if 'location' in request.get_json() and not isinstance(request.json['location'], six.string_types):
        abort(400)


@app.route('/api/v1.0/items/<int:item_id>', methods=['DELETE'])
@token_auth.login_required
def delete_item(item_id):
    """
    Delete item with id.
    :param: item
    :return: json
    """
    items = DB.retrieve_items()
    item = [item for item in items if item['id'] == item_id]
    item_length = len(item)
    if item_length == 0:
        abort(404)
    DB.remove_item(item[0])
    return jsonify({'result': True})


if __name__ == '__main__':
    app.run(debug=True)
