from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, URL

class NewPlaylistForm(FlaskForm):
  user_id = IntegerField('user_id', validators=[DataRequired()])
  title = StringField('title', validators=[DataRequired()])
  songs_order = StringField('songs_order', validators=[DataRequired()])


class EditPlaylistForm(FlaskForm):
  id = IntegerField('id', validators=[DataRequired()])
  title = StringField('title', validators=[DataRequired()])
  songs_order = StringField('songs_order', validators=[DataRequired()])
  description = StringField('description')
