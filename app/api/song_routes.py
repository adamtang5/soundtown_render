from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db, Song, User
from datetime import datetime
from app.forms import NewSongForm, EditSongForm, SongToggleLikeForm
from app.api.utils import (
  validation_errors_to_error_messages,
  not_found_error,
  FILE_TYPE_ERROR,
  UNAUTHORIZED_ERROR
)
from app.s3_helpers import (
  upload_file_to_s3, allowed_file, get_unique_filename
)

song_routes = Blueprint('song', __name__)


# POST /api/songs/
@song_routes.route('/', methods=['POST'])
@login_required
def new_song():
  """
  Create a New Song
  """
  form = NewSongForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    raw_image_file = request.files['image_url']
    raw_audio_file = request.files['audio_url']

    if not allowed_file(raw_image_file.filename) or not allowed_file(raw_audio_file.filename):
      return FILE_TYPE_ERROR
    raw_image_file.filename = get_unique_filename(raw_image_file.filename)
    raw_audio_file.filename = get_unique_filename(raw_audio_file.filename)

    song = Song(
      user_id=request.form['user_id'],
      title=request.form['title'],
      audio_url=upload_file_to_s3(raw_audio_file)['url'],
      description=request.form['description'],
      image_url=upload_file_to_s3(raw_image_file)['url'],
    )
    db.session.add(song)
    db.session.commit()
    return song.to_extended_dict()
  else:
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


#PUT /api/songs/:id
@song_routes.route('/<uuid:id>', methods=['PUT'])
@login_required
def edit_song(id):
  """
  Edit Song
  """
  form = EditSongForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    song = Song.query.get(id)
    if not song:
      return not_found_error('song')

    if current_user.id != song.user_id:
      return UNAUTHORIZED_ERROR

    raw_image_url = request.form.get('image_url')
    raw_image_file = request.files.get('image_url')
    raw_audio_url = request.form.get('audio_url')
    raw_audio_file = request.files.get('audio_url')

    if raw_image_url == '':
      song.image_url = ''
    elif raw_image_file:
      if not allowed_file(raw_image_file.filename):
        return FILE_TYPE_ERROR
      raw_image_file.filename = get_unique_filename(raw_image_file.filename)
      song.image_url = upload_file_to_s3(raw_image_file)['url']

    if not raw_audio_url and not raw_audio_file:
      return jsonify({"errors": ["audio url is required"]}), 400
    elif raw_audio_file:
      if not allowed_file(raw_audio_file.filename):
        return FILE_TYPE_ERROR
      raw_audio_file.filename = get_unique_filename(raw_audio_file.filename)
      song.audio_url = upload_file_to_s3(raw_audio_file)['url']

    song.title = request.form.get('title')
    song.description = request.form.get('description', '')
    song.updated_at = datetime.now()
    db.session.commit()
    return song.to_extended_dict()
  else:
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


# GET /api/songs/
@song_routes.route('/')
def get_all_songs():
  """
  Get All Songs
  """
  songs = Song.query.all()
  return jsonify([song.to_dict() for song in songs])


# GET /api/songs/:id
@song_routes.route('/<uuid:id>')
def get_song(id):
  """
  Get song by id
  """
  song = Song.query.get(id)
  if song:
    return song.to_extended_dict()
  else:
    return not_found_error('song')


# DELETE /api/songs/:id
@song_routes.route('/<uuid:id>', methods=['DELETE'])
@login_required
def delete_song(id):
  """
  Delete song of id
  """
  song = Song.query.get(id)
  if not song:
    return not_found_error('song')
  
  if current_user.id != song.user_id:
    return UNAUTHORIZED_ERROR

  db.session.delete(song)
  db.session.commit()
  return {'id': id}


# POST /api/songs/:id/toggleLike
@song_routes.route('/<uuid:id>/toggleLike', methods=['POST'])
@login_required
def toggle_like_song(id):
  """
  Toggle Like on a Song
  """
  form = SongToggleLikeForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    song = Song.query.get(id)
    user = User.query.get(request.form['user_id'])

    if not song:
      return not_found_error('song')
    if not user:
      return not_found_error('user')
    
    if current_user.id != user.id:
      return UNAUTHORIZED_ERROR
    
    if user not in song.likes:
      song.likes.append(user)
    else:
      song.likes.remove(user)

    db.session.commit()
    return song.to_extended_dict()