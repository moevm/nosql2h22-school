import hashlib
import random
import string

from bson import ObjectId

from utils.db import db

random_string = lambda x: "".join(
    random.choices(string.ascii_lowercase + string.digits, k=x)
)


class UseCase:
    def __init__(self):
        self.user = db.user
        self.schedule = db.schedule
        self.classes = db.classes
        self.subjects = db.subjects
        self.journal = db.journal

    def fill_with_test_data(self):
        teacher = test.create_user(
            {
                "name": "Иван",
                "surname": "Иванов",
                "patronymic": "Иванович",
                "type": "teacher",
            }
        )
        student = test.create_user(
            {
                "name": "Иван",
                "surname": "Иванов",
                "patronymic": "Иванович",
                "type": "student",
            }
        )
        self.subjects.insert_one(
            {"name": "математика", "teacher_id": teacher.get("_id")}
        )
        current_class = self.classes.insert_one(
            {"number": 9, "symbol": "A", "students": [student.get("_id")]}
        ).inserted_id
        subject = self.subjects.find_one({"teacher_id": teacher.get("_id")})
        self.schedule.insert_one(
            {
                "class_id": current_class,
                "weekday": "понедельник",
                "subjects": [subject.get("_id")],
            }
        )
        self.journal.insert_one(
            {
                "subject_id": subject.get("_id"),
                "student_id": student.get("_id"),
                "mark": 4,
                "work": {"type": "д/з", "date": "24-02-2022", "comment": "solve 2+2"},
            }
        )

    def create_user(self, user_data):
        assert user_data["type"] in ["student", "teacher", "parent"]
        user_data["username"] = random_string(15)
        password = random_string(15)
        user_data["password"] = hashlib.md5(password.encode("utf-8")).hexdigest()
        self.user.insert_one(user_data)
        return {**user_data, **{"password": password}}

    def create_class(self, class_data):
        assert all(class_data.get(param) for param in ["number", "students", "symbol"])
        class_data["students"] = [
            ObjectId(student_id) for student_id in class_data["students"]
        ]
        return self.classes.insert_one(class_data).inserted_id

    def get_students(self):
        return [stud for stud in self.user.find({"type": "student"})]

    def auth_user(self, auth_data):
        assert "username" in auth_data and "password" in auth_data
        auth_data["password"] = hashlib.md5(
            auth_data["password"].encode("utf-8")
        ).hexdigest()
        return self.user.find_one(auth_data)

    def get_user_journal(self, user_id):
        return [day for day in self.journal.find({"student_id": ObjectId(user_id)})]

    def serialize(self, table, obj_id):
        return self.__getattribute__(table).find_one({"_id": obj_id})

    def serialize_object(self, obj):
        def get_table(name):
            tables = ["user", "schedule", "classes", "subjects", "journal"]
            return next((table for table in tables if name in table), None)

        for field in obj:
            if "_id" not in field:
                table = get_table(field)
                if isinstance(obj[field], ObjectId) and table:
                    obj[field] = self.serialize(table, obj[field])
                elif (
                    table
                    and isinstance(obj[field], list)
                    and all(isinstance(elem, ObjectId) for elem in obj[field])
                ):
                    obj[field] = [self.serialize(table, elem) for elem in obj[field]]
        return obj

    def get_user_schedule(self, user_id=None, class_id=None):
        assert user_id or class_id
        if user_id and not class_id:
            class_id = self.classes.find_one({"students": ObjectId(user_id)}).get("_id")
        return [
            self.serialize_object(day)
            for day in self.schedule.find({"class_id": ObjectId(class_id)})
        ]

    def search(self, table, text):
        search_result = []
        for data in self.__getattribute__(table).find():
            if text in str(data):
                search_result.append(data)
        return search_result

    def export_table(self, table):
        return [data for data in self.__getattribute__(table).find()]

    def import_data(self, table, data_list):
        table = self.__getattribute__(table)
        for data_obj in data_list:
            table.insert_one(data_obj)

    def set_mark(self, journal_id, new_mark):
        self.journal.update_one(
            {"_id": ObjectId(journal_id)}, {"$set": {"mark": new_mark}}
        )

    def create_new_work(self, work_data):
        assert all(
            work_data.get(param) for param in ["subject_id", "comment", "date", "type"]
        )
        assert work_data.get("student_id") or work_data.get("class_id")
        if work_data.get("student_id"):
            self.journal.insert_one(
                {
                    "mark": 0,
                    "student_id": ObjectId(work_data.get("student_id")),
                    "subject_id": ObjectId(work_data.get("subject_id")),
                    "work": {
                        "comment": work_data.get("comment"),
                        "date": work_data.get("date"),
                        "type": work_data.get("type"),
                    },
                }
            )
        elif work_data.get("class_id"):
            self.journal.insert_many(
                [
                    {
                        "mark": 0,
                        "student_id": student_id,
                        "subject_id": ObjectId(work_data.get("subject_id")),
                        "work": {
                            "comment": work_data.get("comment"),
                            "date": work_data.get("date"),
                            "type": work_data.get("type"),
                        },
                    }
                    for student_id in self.classes.find_one(
                        {"_id": ObjectId(work_data.get("class_id"))}
                    ).get("students")
                ]
            )


test = UseCase()
student = test.create_user(
    {"name": "Иван", "surname": "Иванов", "patronymic": "Иванович", "type": "student"}
)
print(
    test.auth_user({"username": student["username"], "password": student["password"]})
)
print(test.fill_with_test_data())
student_id = test.get_students()[-1].get("_id")
print(test.get_user_journal(student_id))
test.set_mark(test.get_user_journal(student_id)[-1].get("_id"), 5)
print(test.get_user_schedule(student_id))
print(test.search("user", "teacher"))
print(test.export_table("user"))
print(
    test.import_data(
        "user",
        [
            {
                "name": "Иван",
                "password": "1508903a47b86c5e38a8efcb4995f3da",
                "patronymic": "Иванович",
                "surname": "Иванов",
                "type": "student",
                "username": "46b8e11c30arimq",
            }
        ],
    )
)
test.create_new_work(
    {
        "student_id": "635e8a4a2af02f90723c77e1",
        "subject_id": "635e8a4a2af02f90723c77e2",
        "comment": "2-2",
        "date": "12-12-2022",
        "type": "д/з",
    }
)
test.create_new_work(
    {
        "class_id": "635e752d8fd314e69ae84c0b",
        "subject_id": "635e8a4a2af02f90723c77e2",
        "comment": "2-2",
        "date": "12-12-2022",
        "type": "д/з",
    }
)
test.create_class({"number": 9, "symbol": "A", "students": [student_id]})
