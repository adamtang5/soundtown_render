from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class NewPlaylistForm(FlaskForm):
  user_id = StringField('user_id', validators=[DataRequired()])
  title = StringField('title', validators=[DataRequired()])
  songs_order = StringField('songs_order', validators=[DataRequired()])


class EditPlaylistForm(FlaskForm):
  title = StringField('title', validators=[DataRequired()])
  songs_order = StringField('songs_order', validators=[DataRequired()])
  description = StringField('description')


class PlaylistToggleLikeForm(FlaskForm):
  user_id = StringField('user_id', validators=[DataRequired()])