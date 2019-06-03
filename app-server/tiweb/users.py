from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, IntegerField, SubmitField
from wtforms.validators import InputRequired, Email, length, IPAddress, ValidationError, EqualTo
from flask_security import UserMixin, RoleMixin

from tiweb import app

db = SQLAlchemy(app)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) 
    public_id = db.Column(db.String(50), unique = True)                               
    first_name  = db.Column(db.String(15))
    last_name = db.Column(db.String(15))
    email = db.Column(db.String(50), unique = True)
    db_ip = db.Column(db.String(50))
    db_port = db.Column(db.Integer)
    username = db.Column(db.String(15), unique = True)
    password = db.Column(db.String(80))
    admin = db.Column(db.Boolean)

class RegistrationForm(FlaskForm):
    first_name = StringField('first_name', validators = [InputRequired()])
    last_name = StringField('last_name', validators = [InputRequired()])
    email = StringField('email', validators = [InputRequired(), Email(message = 'Invalid Email')])
    #db_ip = StringField('db_ip', validators = [InputRequired(), IPAddress(ipv4 = True, ipv6 = False, message = 'Enter valid db_ip address')])
    #db_port = IntegerField('db_port', validators = [InputRequired()])
    username = StringField('username', validators = [InputRequired(), length(min = 4, max = 15)])
    password = PasswordField('password', validators = [InputRequired(), length(min = 4,max = 80)])
    admin = BooleanField('admin')
    
class LoginForm(FlaskForm):
    public_id = StringField('public_id')
    #first_name = StringField('first_name', validators = [InputRequired()])
    #last_name = StringField('last_name', validators = [InputRequired()])
    username = StringField('username', validators = [InputRequired(), length(min = 4, max = 15)])
    password = PasswordField('password', validators = [InputRequired(), length(min = 8,max = 80)])