from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db, Song, User
from app.forms import NewSongForm, EditSongForm
from datetime import datetime
from app.api.utils import (
  validation_errors_to_error_messages, FILE_TYPE_ERROR, UNAUTHORIZED_ERROR
)
from app.s3_helpers import (
  upload_file_to_s3, allowed_file, get_unique_filename)
from sqlalchemy.orm import relationship, sessionmaker, joinedload

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
    return song.to_dict()
    # keys = list(request.files.to_dict().keys())
    # if len(keys) != 2:
    #   return jsonify({"error": "Missing file(s)"}), 400
    # raw_audio_url = request.files["audio_url"]
    # print("---------------audio url----------------", raw_audio_url)
    # raw_image_url = request.files["image_url"]
    # print("---------------image url----------------", raw_image_url)

    # if not allowed_file(raw_audio_url.filename):
    #   return {"errors": ["audio file type not permitted"]}

    # if not allowed_file(raw_image_url.filename):
    #   return {"errors": ["image file type not permitted"]}

    # raw_audio_url.filename = get_unique_filename(raw_audio_url.filename)
    # raw_image_url.filename = get_unique_filename(raw_image_url.filename)

    # audio_upload = upload_file_to_s3(raw_audio_url)
    # image_upload = upload_file_to_s3(raw_image_url)

    # audio_url = audio_upload["url"]
    # image_url = image_upload["url"]

  else:
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


#PUT /api/songs/:id
@song_routes.route('/<int:id>', methods=['PUT'])
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
      return jsonify({"errors": ["song not found"]}), 404

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

    song.title = request.form['title']
    song.description = request.form['description']
    song.updated_at = datetime.now()
    db.session.commit()
    return song.to_dict()

    # if not any(request.files):
    #   song = Song.query.get(int(request.form["id"]))
    # else:
    #   keys = list(request.files.to_dict().keys())
    #   if len(keys) == 2:
    #     raw_audio_url = request.files["audio_url"]
    #     raw_image_url = request.files["image_url"]

    #     if not allowed_file(raw_audio_url.filename):
    #       return {"errors": ["audio file type not permitted"]}

    #     if not allowed_file(raw_image_url.filename):
    #       return {"errors": ["image file type not permitted"]}

    #     raw_audio_url.filename = get_unique_filename(
    #       raw_audio_url.filename)
    #     raw_image_url.filename = get_unique_filename(
    #       raw_image_url.filename)

    #     audio_upload = upload_file_to_s3(raw_audio_url)
    #     image_upload = upload_file_to_s3(raw_image_url)

    #     audio_url = audio_upload["url"]
    #     image_url = image_upload["url"]

    #     song = Song.query.get(int(request.form["id"]))
    #     song.title = request.form['title']
    #     song.audio_url = audio_url,
    #     song.description = request.form['description']
    #     song.image_url = image_url
    #     song.updated_at = datetime.now()
    #   elif keys[0] == "audio_url":
    #     raw_audio_url = request.files["audio_url"]

    #     if not allowed_file(raw_audio_url.filename):
    #       return {"errors": ["audio file type not permitted"]}

    #     raw_audio_url.filename = get_unique_filename(
    #       raw_audio_url.filename)

    #     audio_upload = upload_file_to_s3(raw_audio_url)

    #     audio_url = audio_upload["url"]

    #     song = Song.query.get(int(request.form["id"]))
    #     song.title = request.form['title']
    #     song.audio_url = audio_url,
    #     song.description = request.form['description']
    #     song.updated_at = datetime.now()
    #   elif keys[0] == "image_url":
    #     raw_image_url = request.files["image_url"]

    #     if not allowed_file(raw_image_url.filename):
    #       return {"errors": ["image file type not permitted"]}

    #     raw_image_url.filename = get_unique_filename(
    #       raw_image_url.filename)

    #     image_upload = upload_file_to_s3(raw_image_url)

    #     image_url = image_upload["url"]

    #     song = Song.query.get(int(request.form["id"]))
    #     song.title = request.form['title']
    #     song.description = request.form['description']
    #     song.image_url = image_url
    #     song.updated_at = datetime.now()
  else:
    return {'errors': validation_errors_to_error_messages(form.errors)}

# GET /api/songs/
@song_routes.route('/')
def get_all_songs():
  """
  Get All Songs
  """
  songs = Song.query.all()
  return jsonify([song.to_dict() for song in songs])


@song_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_song(id):
  """
  Delete song of id
  """
  song = Song.query.get(id)
  if song:

      db.session.delete(song)
      db.session.commit()
      return {'id': id}
  else:
      return {'errors': validation_errors_to_error_messages(form.errors)}, 401


# GET /api/songs/:id/comments
@song_routes.route('/<int:id>/comments')
def get_comments_by_song_id(id):
  """
  Get all comments of song ID
  """
  song = Song.query.get(id)
  if song:
      return jsonify([comment.to_dict() for comment in song.comments])
  else:
      return {'errors': validation_errors_to_error_messages(form.errors)}, 401
