from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_dotenv import DotEnv
from flask_login import LoginManager

app = Flask(__name__)
env = DotEnv(app)
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

login = LoginManager(app)
login.login_view = 'login'




from server import routes, models


# Flask-admin stuff

admin = Admin(app, name="enkelHandel", template_mode='bootstrap3')
class ChildView(ModelView):
    column_display_pk = True # optional, but I like to see the IDs in the list
    column_hide_backrefs = False
    # column_list = ('id', 'name', 'parent')

admin.add_view(ChildView(models.Category, db.session))
admin.add_view(ChildView(models.SubCategory, db.session))
admin.add_view(ChildView(models.SubSubCategory, db.session))
admin.add_view(ChildView(models.Product, db.session))
admin.add_view(ChildView(models.Order, db.session))
admin.add_view(ChildView(models.Sale, db.session))
admin.add_view(ChildView(models.Customer, db.session))
