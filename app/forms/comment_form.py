from flask_wtf import FlaskForm
from wtforms import StringField, TimeField, SubmitField
from wtforms.validators import DataRequired


class NewCommentForm(FlaskForm):
  user_id = StringField('user_id', validators=[DataRequired()])
  song_id = StringField('song_id', validators=[DataRequired()])
  message = StringField('message', validators=[DataRequired()])
  parent_id = StringField('parent_id')
  song_timestamp = TimeField('song_timestamp')
  submit = SubmitField('submit')


class EditCommentForm(FlaskForm):
  message = StringField('message', validators=[DataRequired()])
  submit = SubmitField('submit')


class CommentToggleLikeForm(FlaskForm):
  user_id = StringField('user_id', validators=[DataRequired()])