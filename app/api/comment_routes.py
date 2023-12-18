from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db, Comment, Song
from app.forms import NewCommentForm, EditCommentForm
from datetime import datetime, time
from app.api.utils import (
  validation_errors_to_error_messages,
  not_found_error,
  FILE_TYPE_ERROR,
  UNAUTHORIZED_ERROR
)
import uuid

comment_routes = Blueprint('comment', __name__)


# POST /api/comments
@comment_routes.route('/', methods=['POST'])
@login_required
def new_comment():
  """
  Create a New Comment
  """
  form = NewCommentForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    comment = Comment(
      message=form.data['message'],
      user_id=uuid.UUID(form.data['user_id']),
      song_id=uuid.UUID(form.data['song_id']),
      parent_id=uuid.UUID(form.data['parent_id']) if 'parent_id' in form.data else None,
      song_timestamp=form.data['song_timestamp'],
    )
    db.session.add(comment)
    db.session.commit()

    song = Song.query.get(form.data['song_id'])
    return song.to_extended_dict()
  else:
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


# PUT /api/comments/:id
@comment_routes.route('/<uuid:id>', methods=['PUT'])
@login_required
def edit_comment(id):
  """
  Edit Comment at ID
  """
  form = EditCommentForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    comment = Comment.query.get(id)
    if not comment:
      return not_found_error('comment')
    
    if current_user.id != comment.user_id:
      return UNAUTHORIZED_ERROR

    comment.message = form.data['message']
    comment.updated_at = datetime.now()
    db.session.commit()

    song = Song.query.get(comment.song_id)
    return song.to_extended_dict()
  else:
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


# DELETE /api/comments/:id
@comment_routes.route('/<uuid:id>', methods=['DELETE'])
def delete_comment(id):
  """
  Delete Comment of id
  """
  comment = Comment.query.get(id)
  if not comment:
    return not_found_error('comment')
  
  if current_user.id != comment.user_id:
    return UNAUTHORIZED_ERROR

  song_id = comment.song_id
  db.session.delete(comment)
  db.session.commit()

  song = Song.query.get(song_id)
  return song.to_extended_dict()