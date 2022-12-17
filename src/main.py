from flask import Flask

from scripts import add_users
from utils import views, config

from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.add_url_rule('/login', view_func=views.LoginView.as_view('login'), methods=views.LoginView.methods)
app.add_url_rule('/user', view_func=views.UserView.as_view('user'), methods=views.UserView.methods)
app.add_url_rule('/class', view_func=views.ClassView.as_view('class'), methods=views.ClassView.methods)
app.add_url_rule('/schedule', view_func=views.ScheduleView.as_view('schedule'), methods=views.ScheduleView.methods)
app.add_url_rule('/subject', view_func=views.SubjectView.as_view('subject'), methods=views.SubjectView.methods)
app.add_url_rule('/journal', view_func=views.JournalView.as_view('journal'), methods=views.JournalView.methods)

if __name__ == '__main__':
    add_users.seed_users()
    app.run(port=config.APP_PORT, host=config.APP_HOST)
