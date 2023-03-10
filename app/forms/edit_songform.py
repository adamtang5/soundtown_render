from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, URL


class EditSongForm(FlaskForm):
  id = IntegerField('id', validators=[DataRequired()])
  title = StringField('title', validators=[DataRequired()])
  description = StringField('description')
