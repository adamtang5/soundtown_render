from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import Length


class EditUserForm(FlaskForm):
  display_name=StringField('display_name', validators=[Length(min=3, max=50)])