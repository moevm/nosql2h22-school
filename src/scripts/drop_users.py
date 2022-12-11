import sys
sys.path.append('../')


from controller.controller import Controller
from controller.models import TableName


controller = Controller()

controller.import_table(TableName.users, [])