import enum


class UserType(enum.Enum):
    student = 'student'
    teacher = 'teacher'
    parent = 'parent'
    admin = 'admin'


class TableName(enum.Enum):
    users = 'users'
    classes = 'classes'
    schedule = 'schedule'
    subjects = 'subjects'
    journal = 'journal'
