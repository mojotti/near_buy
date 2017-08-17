"""
'app.py' provides a RESTful API for NearBuy app.
"""
import sys
import six
from flask import Flask, jsonify, abort, request, make_response, url_for
from flask_httpauth import HTTPBasicAuth
from database import DatabaseHelper, TestDB

app = Flask(__name__, static_url_path="")
auth = HTTPBasicAuth()

if sys.argv[0] == 'app.py':
    DB = DatabaseHelper()
else:
    DB = TestDB()  # if running unit tests


@auth.verify_password
def verify_password(username, password):
    """Returns a hashed password when password is queried with username."""
    return DB.check_password_hash_for_user(username, password)


@auth.error_handler
def unauthorized():
    """Return 403 instead of 401 to prevent browsers from displaying the default auth dialog."""
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
    """"Helper function for get_items(). Collects one item at the time."""
    new_item = {}
    for field in item:
        if field == 'id':
            new_item['uri'] = url_for('get_item', item_id=item['id'],
                                      _external=True)
        else:
            new_item[field] = item[field]
    return new_item


@app.route('/todo/api/v1.0/items', methods=['GET'])
@auth.login_required
def get_items():
    """Get all items."""
    items = DB.retrieve_items()
    return jsonify({'items': [make_public_item(item) for item in items]})


@app.route('/todo/api/v1.0/items/<int:item_id>', methods=['GET'])
@auth.login_required
def get_item(item_id):
    """Get one item with id."""
    items = DB.retrieve_items()
    item = [item for item in items if item['id'] == item_id]
    item_length = len(item)
    if item_length == 0:
        abort(404)
    return jsonify({'item': make_public_item(item[0])})


@app.route('/todo/api/v1.0/items', methods=['POST'])
@auth.login_required
def create_item():
    """Create new item and add it to database."""
    items_list = []
    items = DB.retrieve_items()
    for item in items:
        items_list.append(item)
    if not request.json or 'title' not in request.json or 'price' not in request.json:
        abort(400)
    item = get_item_details(items_list)
    DB.add_item_to_db(item)
    item = DB.retrieve_item_with_title(request.json['title'])
    return jsonify({'item': make_public_item(item)}), 201


def get_item_details(items_list):
    """Get and return all necessary details for item."""
    return {
        'id': items_list[-1]['id'] + 1,
        'title': request.json['title'],
        'price': request.json['price'],
        'seller_id': request.json['seller_id'],
        'description': request.json.get('description', ""),
        'sold': False,
        'location': request.json.get('location', None),
        'pictures': {
                '1': request.json.get('pictures', {}).get('1'),
                '2': request.json.get('pictures', {}).get('2'),
                '3': request.json.get('pictures', {}).get('3')
        }
    }


@app.route('/todo/api/v1.0/items/<int:item_id>', methods=['PUT'])
@auth.login_required
def update_item(item_id):
    """Update one item with id."""
    items = DB.retrieve_items()
    item = [item for item in items if item['id'] == item_id]
    check_if_item_is_valid(item)
    item[0]['title'] = request.json.get('title', item[0]['title'])
    item[0]['description'] = request.json.get('description',
                                              item[0]['description'])
    item[0]['seller_id'] = request.json.get('seller_id', item[0]['seller_id'])
    item[0]['sold'] = request.json.get('sold', item[0]['sold'])
    item[0]['location'] = request.json.get('location', item[0]['location'])
    DB.find_and_update_item(item[0])
    return jsonify({'item': make_public_item(item[0])})


def check_if_item_is_valid(item):
    """Check if all necessary conditions are fulfilled for item."""
    item_length = len(item)
    if item_length == 0:
        abort(404)
    if not request.json:
        abort(400)
    if 'title' in request.json and \
            not isinstance(request.json['title'], six.string_types):
        abort(400)
    if 'price' in request.json and \
            not isinstance(request.json['price'], int):
        abort(400)
    if 'seller_id' in request.json and \
            not isinstance(request.json['seller_id'], int):
        abort(400)
    if 'description' in request.json and \
            not isinstance(request.json['description'], six.string_types):
        abort(400)
    if 'sold' in request.json and not isinstance(request.json['sold'], bool):
        abort(400)
    if 'location' in request.json and not isinstance(request.json['location'], six.string_types):
        abort(400)


@app.route('/todo/api/v1.0/items/<int:item_id>', methods=['DELETE'])
@auth.login_required
def delete_item(item_id):
    """Delete item with id."""
    items = DB.retrieve_items()
    item = [item for item in items if item['id'] == item_id]
    item_length = len(item)
    if item_length == 0:
        abort(404)
    DB.remove_item(item[0])
    return jsonify({'result': True})


if __name__ == '__main__':
    app.run(debug=True)
