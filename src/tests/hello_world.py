import utils.db as db

db.connection.insert_one({'text': 'Hello World'})
print(db.connection.find_one({'text': 'Hello World'}).get('text'))
