import time
import six

from flask import abort, request, url_for


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


def get_item_details(user_data, item_id, user_id):
    """
    Helper for create_item().
    Get and return all necessary details for item.
    :param: user_data
    :return: dictionary
    """
    current_milli_time = int(round(time.time() * 1000))
    return {
        'id': item_id,
        'title': user_data.get('title'),
        'price': int(user_data.get('price')),
        'seller_id': user_id,
        'description': user_data.get('description'),
        'sold': False,
        'latitude': user_data.get('latitude'),
        'longitude': user_data.get('longitude'),
        'item_created': current_milli_time
    }


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
            not isinstance(request.get_json()['price'], int or \
            not isinstance(request.get_json()['price'], six.string_types)):
        abort(400)
    if 'description' in request.get_json() and \
            not isinstance(request.get_json()['description'], six.string_types):
        abort(400)
    if 'sold' in request.get_json() and not isinstance(request.get_json()['sold'], bool):
        abort(400)
    if 'latitude' in request.get_json() and not isinstance(request.json['latitude'], float):
        abort(400)
    if 'longitude' in request.get_json() and not isinstance(request.json['longitude'], float):
        abort(400)
