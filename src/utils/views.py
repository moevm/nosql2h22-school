import json

from bson import json_util, ObjectId
from flask import request, Response
from flask.views import View

from controller.controller import Controller
from controller.models import TableName


class TemplateView(View):
    methods = ["GET", "POST"]

    controller = Controller()

    def dispatch_request(self):
        if request.method == "POST":
            return self.post()
        elif request.method == "GET":
            return self.get()
        else:
            return Response(status=400, response=json.dumps({'error': 'Bad request'}))

    def get(self):
        pass

    def post(self):
        pass


class UserView(TemplateView):
    def get(self):
        return Response(status=200, response=json_util.dumps(self.controller.export_table(TableName.users)))

    def post(self):
        self.controller.create_user(**request.json)
        return Response(status=200, response=json_util.dumps({'ok': True}))


class ClassView(TemplateView):
    def get(self):
        return Response(status=200, response=json_util.dumps(self.controller.export_table(TableName.classes)))

    def post(self):
        self.controller.create_class(**request.json)
        return Response(status=200, response=json_util.dumps({'ok': True}))


class ScheduleView(TemplateView):
    methods = ['GET']

    def get(self):
        return Response(
            status=200,
            response=json_util.dumps(
                self.controller.get_schedule(request.args.get('student_id'))
            )
        )


class SubjectView(TemplateView):
    def get(self):
        return Response(status=200, response=json_util.dumps(self.controller.export_table(TableName.subjects)))

    def post(self):
        response = self.controller.add_subject(
            teacher_id=ObjectId(request.json['teacher_id']),
            name=request.json['name']
        )
        return Response(status=200, response=json_util.dumps(response))


class JournalView(TemplateView):
    def get(self):
        return Response(status=200, response=json_util.dumps(self.controller.export_table(TableName.journal)))

    def post(self):
        response = self.controller.add_mark(
            student_id=ObjectId(request.json['student_id']),
            subject_id=ObjectId(request.json['subject_id']),
            mark=request.json['mark'],
            work=request.json['work'],
        )
        return Response(status=200, response=json_util.dumps(response))
