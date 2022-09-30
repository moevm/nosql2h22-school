from pymongo import MongoClient

client = MongoClient(port=27017)
db = client.school_management
connection = db.test_connection
