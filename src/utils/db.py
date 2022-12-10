from pymongo import MongoClient

from utils import config

client = MongoClient(port=config.MONGO_PORT)
db = client.school_management
connection = db.test_connection
