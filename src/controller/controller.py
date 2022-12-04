from bson.objectid import ObjectId
import hashlib

from utils.db import db
from controller.models import UserType, TableName

from typing import Optional, List


class Controller:
    def __init__(self):
        self.users = db.users
        self.classes = db.classes
        self.schedule = db.schedule
        self.subjects = db.subjects
        self.journal = db.journal

    def create_user(self, type: UserType, username: str, password: str, personal_info: dict, parent_id: Optional[str] = None):
        user = dict(personal_info, {'user_name': username, 'password': hashlib.md5(
            password.encode('utf-8')).hexdigest()}, {'type': type})
        if parent_id:
            user = dict(user, {'parent_id': parent_id})
        self.users.insert_one(user)

    def auth_user(self, username: str, password: str) -> bool:
        user = {'user_name': username, 'password': hashlib.md5(
            password.encode('utf-8')).hexdigest()}
        return self.user.find_one(user)

    def create_class(self, number: int, symbol: str) -> ObjectId:
        _class = {'number': number, 'symbol': symbol, 'students': []}
        _id = self.classes.insert_one(_class)
        return _id.inserted_id

    def add_students_to_class(self, class_id: ObjectId, students: List[ObjectId]):
        _class = self.classes.find_one({'_id': class_id})
        if _class:
            self.classes.update_one({
                '_id': class_id
            }, {
                '$set': {
                    'students': _class['students'] + students
                }
            }, upsert=False)

    def get_table(self, table: TableName):
        db_table = None
        if table == TableName.classes:
            db_table = self.classes
        elif table == TableName.users:
            db_table = self.users
        elif table == TableName.schedule:
            db_table = self.schedule
        elif table == TableName.subjects:
            db_table = self.subjects
        elif table == TableName.journal:
            db_table = self.journal
        return db_table

    def export_table(self, table: TableName):
        result = []
        db_table = self.get_table(table)
        for row in db_table.find():
            result.append(row)
        return result

    def import_table(self, table: TableName, data: List[dict]):
        db_table = self.get_table(table)
        db_table.drop()
        if data:
           db_table.insert_many(data, ordered=False)

    def add_subject(self, teacher_id:  ObjectId, name: str) -> ObjectId:
        _subject = {'teacher_id': teacher_id, 'name': name}
        _id = self.subjects.insert_one(_subject)
        return _id.inserted_id

    def add_mark(self, student_id:  ObjectId, subject_id: ObjectId, mark: int, work: dict) -> ObjectId:
        _mark = {'student_id': student_id,
                 'subject_id': subject_id, 'mark': mark, 'work': work}
        _id = self.journal.insert_one(_mark)
        return _id.inserted_id

    def get_schedule(self, student_id: ObjectId):
        _class = self.classes.find_one(
            {'students': {'$in': [ObjectId('638cce7995ce2b79bd93f256')]}})
        class_id = _class['_id']

        result = list()
        for schedule in self.schedule.find({'class_id': {class_id}}):
            one_day = {
                'weekday': schedule['weekday'],
                'subjects': [],
            }
            for subject_id in schedule['subjects']:
                subject = self.subjects.find_one({'_id': subject_id})
                result['subjects'].append(subject['name'])
            result.append(one_day)
        return result

    def get_school_diary(self, student_id: ObjectId):
        result = list()
        for schedule in self.journal.find({'student_id': {student_id}}):
            one_mark = {
                'subject_name': schedule['name'],
                'mark': schedule['mark'],
                'work': schedule['work']
            }
            subject = self.subjects.find_one({'_id': schedule['subject_id']})
            one_mark = dict(one_mark, **{'subject_name':subject['name']})
            result.append(one_mark)
        return result

    def get_collection(self, table: TableName, sort_settings: dict, limit: int, offset: int) -> dict:
        db_table = self.get_table(self, table)
        cursor = db_table.find().sort(sort_settings).skip(offset).limit(limit)
        result = []
        for row in cursor:
            result.append(row)
        return row
