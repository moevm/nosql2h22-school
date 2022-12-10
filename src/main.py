from flask import Flask

from utils import views, config

app = Flask(__name__)

app.add_url_rule('/user', view_func=views.UserView.as_view('user'), methods=views.UserView.methods)
app.add_url_rule('/class', view_func=views.ClassView.as_view('class'), methods=views.ClassView.methods)
app.add_url_rule('/schedule', view_func=views.ScheduleView.as_view('schedule'), methods=views.ScheduleView.methods)
app.add_url_rule('/subject', view_func=views.SubjectView.as_view('subject'), methods=views.SubjectView.methods)
app.add_url_rule('/journal', view_func=views.JournalView.as_view('journal'), methods=views.JournalView.methods)

if __name__ == '__main__':
    app.run(port=config.APP_PORT, host=config.APP_HOST)
