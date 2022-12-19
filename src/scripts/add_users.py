import sys
sys.path.append('../')

from bson import ObjectId

from controller.controller import Controller
from controller.models import UserType

controller = Controller()


def seed_users():
    if not controller.auth_user(username='admin', password='admin'):
        controller.create_user(
            type=UserType.admin,
            username='admin',
            password='admin',
            personal_info={}
        )

        controller.create_user(
            type=UserType.parent,
            username='parent',
            password='parent',
            personal_info={'name': 'parent', 'surname': 'parent'}
        )

        controller.create_user(
            type=UserType.teacher,
            username='teacher',
            password='teacher',
            personal_info={'name': 'teacher', 'surname': 'teacher'}
        )

        parent = controller.auth_user(
            username='parent',
            password='parent'
        )

        controller.create_user(
            type=UserType.student,
            username='student',
            password='student',
            personal_info={'name': 'student', 'surname': 'student'},
            parent_id=parent['_id']
        )

        sch_class = controller.create_class(number=1, symbol='A')

        student = controller.auth_user(username='student', password='student')
        controller.add_students_to_class(class_id=ObjectId(sch_class), students=[ObjectId(student['_id'])])
