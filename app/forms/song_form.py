from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired


class NewSongForm(FlaskForm):
  user_id = StringField('user_id', validators=[DataRequired()])
  title = StringField('title', validators=[DataRequired()])
  description = StringField('description')


class EditSongForm(FlaskForm):
  id = StringField('id', validators=[DataRequired()])
  title = StringField('title', validators=[DataRequired()])
  description = StringField('description')


class SongToggleLikeForm(FlaskForm):
  user_id = StringField('user_id', validators=[DataRequired()])