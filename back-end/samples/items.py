import os
import shutil
import Config

DB_ITEM1 = {
    'id': 1,
    'title': u'Nike Shoes AirMax',
    'price': 15,
    'description': u'Hardly used air maxes. Get em while you can',
    'sold': False,
    'longitude': '-121.45356',
    'latitude': '24.5114392',
    'seller_id': 0
}

DB_ITEM2 = {
    'id': 2,
    'title': u'MacBook Air mid 2012',
    'price': 600,
    'description': u'Killer Mac for serious use. You will love it.',
    'sold': False,
    'longitude': '-121.45356',
    'latitude': '24.5114392',
    'seller_id': 0
}

DB_ITEM3 = {
    'id': 3,
    'title': u'Something beautiful',
    'price': 50,
    'description': u'Oh this is good item.',
    'sold': False,
    'longitude': '-121.45356',
    'latitude': '24.5114392',
    'seller_id': 1
}

ITEM1 = "{'title': 'item 1', 'price': 123, 'description': 'best stuff you can get', 'latitude': 163.020, 'longitude': "\
           "200.4040}"
ITEM2 = "{'title': 'item 2', 'price': 600, 'description': 'very good stuff', 'latitude': -140.020, 'longitude': " \
           "-20.4040}"
ITEM3 = "{'title': 'item 3', 'price': 23143, 'description': 'this is item 3', 'latitude': -140.020, 'longitude': " \
           "-20.4040}"
NEW_ITEM = "{'title': 'new_item', 'price': 100, 'description': 'almost brand new stuff', 'latitude': 63.020, " \
           "'longitude': 20.4040}"

HASH = {b'$2b$04$0NDkor0GmQki6i5zJiqNsu8hNtqGf5UJv3TPWRwLgs51Alo7cJJve'}
HASH_2 = {b'$2b$04$p5VV5hvav5LTFEv0z7hJQupI/Dc6K4lFWXqD2Dv9bQ3rv/hDQe3Ry'}

CHAT = [
    {
        'id': 0,
        'buyer_id': 1,
        'seller_id': 0
     },
]


def rm_test_pictures():
    for root, dirs, files in os.walk(Config.testing_folder):
        for f in files:
            os.unlink(os.path.join(root, f))
        for d in dirs:
            shutil.rmtree(os.path.join(root, d))
