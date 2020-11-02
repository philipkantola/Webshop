from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo
from server.models import Customer

class LoginForm(FlaskForm):
    email = StringField('Mailadress', validators=[DataRequired()])
    password = PasswordField('Lösenord', validators=[DataRequired()])
    remember_me = BooleanField('Kom ihåg mig')
    submit = SubmitField('Logga in')

class RegistrationForm(FlaskForm):
    firstname = StringField('Förnamn', validators=[DataRequired()])
    lastname = StringField('Efternamn', validators=[DataRequired()])
    email = StringField('Mailadress', validators=[DataRequired(), Email()])
    password = PasswordField('Lösenord', validators=[DataRequired()])
    password2 = PasswordField(
        'Skriv lösenord igen', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Registrera')

    def validate_email(self, email):
        user = Customer.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError('Denna mailadress används redan.')