import json

from bson import json_util, ObjectId
from flask import request, Response
from flask.views import View

from controller.controller import Controller
from controller.models import TableName


class TemplateView(View):

    methods = ['GET', 'POST']

    controller = Controller()

    def dispatch_request(self):
        if not self.user_have_access():
            return Response(status=403,
                            response=json.dumps({'error': 'Forbidden'}))
        if request.method == 'POST':
            return self.post()
        elif request.method == 'GET':
            return self.get()
        else:
            return Response(status=400,
                            response=json.dumps({'error': 'Bad request'
                            }))

    def get(self):
        pass

    def post(self):
        pass

    def user_have_access(self):
        (username, password) = request.headers.get('Authorization'
                ).split(':')
        user = self.controller.auth_user(username=username,
                password=password)
        post_allowed_types = ['teacher', 'admin']
        if user['type'] == 'admin':
            return True
        if not user:
            return False
        if user['type'] != 'teacher' and request.method == 'POST':
            return False
        if request.path == '/user' and user['type'] \
            not in post_allowed_types:
            return False
        if request.path == '/class' and user['type'] \
            not in post_allowed_types:
            return False
        return True


class UserView(TemplateView):

    def get(self):
        return Response(status=200,
                        response=json_util.dumps(self.controller.export_table(TableName.users)))

    def post(self):
        self.controller.create_user(**request.json)
        return Response(status=200,
                        response=json_util.dumps({'ok': True}))


class ClassView(TemplateView):

    def get(self):
        return Response(status=200,
                        response=json_util.dumps(self.controller.export_table(TableName.classes)))

    def post(self):
        self.controller.create_class(**request.json)
        return Response(status=200,
                        response=json_util.dumps({'ok': True}))


class ScheduleView(TemplateView):

    methods = ['GET']

    def get(self):
        return Response(status=200,
                        response=json_util.dumps(self.controller.get_schedule(ObjectId(request.args.get('student_id'
                        )))))


class SubjectView(TemplateView):

    def get(self):
        return Response(status=200,
                        response=json_util.dumps(self.controller.export_table(TableName.subjects)))

    def post(self):
        response = \
            self.controller.add_subject(teacher_id=ObjectId(request.json['teacher_id'
                ]), name=request.json['name'])
        return Response(status=200, response=json_util.dumps(response))


class JournalView(TemplateView):

    def get(self):
        return Response(status=200,
                        response=json_util.dumps(self.controller.export_table(TableName.journal)))

    def post(self):
        response = \
            self.controller.add_mark(student_id=ObjectId(request.json['student_id'
                ]), subject_id=ObjectId(request.json['subject_id']),
                mark=request.json['mark'], work=request.json['work'])
        return Response(status=200, response=json_util.dumps(response))
