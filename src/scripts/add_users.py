import sys
sys.path.append('../')


from controller.controller import Controller
from controller.models import UserType


controller = Controller()

controller.create_user(type=UserType.admin, username='admin', password='admin',personal_info={})

controller.create_user(type=UserType.parent, username='parent',
                       password='parent', personal_info={'name': 'parent', 'surname': 'parent'})

controller.create_user(type=UserType.teacher, username='teacher',
                       password='teacher', personal_info={'name': 'teacher', 'surname': 'teacher'})

parent = controller.auth_user(username='parent', password='parent')


controller.create_user(type=UserType.student, username='student',
                       password='student', personal_info={'name': 'student', 'surname': 'student'},parent_id=parent['_id'])
