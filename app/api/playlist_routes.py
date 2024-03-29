from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db, User, Playlist, Song, playlist_song
from datetime import datetime
from app.forms import NewPlaylistForm, EditPlaylistForm, PlaylistToggleLikeForm
from app.api.utils import (
  validation_errors_to_error_messages,
  not_found_error,
  FILE_TYPE_ERROR,
  UNAUTHORIZED_ERROR
)
from app.s3_helpers import (
  upload_file_to_s3, allowed_file, get_unique_filename
)
from sqlalchemy import text
# from sqlalchemy.orm import relationship, sessionmaker, joinedload
import json

playlist_routes = Blueprint('playlist', __name__)


# POST /api/playlists/
@playlist_routes.route('/', methods=['POST'])
@login_required
def new_playlist():
  """
  Create a New Playlist
  """
  form = NewPlaylistForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    playlist = Playlist(
      user_id=request.form['user_id'],
      title=request.form['title'],
      songs_order=request.form['songs_order']
    )
    db.session.add(playlist)

    playlist = Playlist.query.order_by(text("created_at desc")).limit(1).one()
    for song_id in json.loads(request.form['songs_order']):
      song = Song.query.get(song_id)
      playlist.songs.append(song)

    db.session.commit()
    return playlist.to_extended_dict()
  else:
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


# PUT /api/playlists/:id
@playlist_routes.route('/<uuid:id>', methods=['PUT'])
@login_required
def edit_playlist(id):
  """
  Edit Playlist
  """
  form = EditPlaylistForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    playlist = Playlist.query.get(id)
    if not playlist:
      return not_found_error('playlist')

    if current_user.id != playlist.user_id:
      return UNAUTHORIZED_ERROR

    raw_image_url = request.form.get('image_url')
    raw_image_file = request.files.get('image_url')

    if raw_image_url == '':
      playlist.image_url = ''
    elif raw_image_file:
      if not allowed_file(raw_image_file.filename):
        return FILE_TYPE_ERROR
      raw_image_file.filename = get_unique_filename(raw_image_file.filename)
      playlist.image_url = upload_file_to_s3(raw_image_file)['url']

    playlist.title = request.form["title"]
    playlist.songs_order = request.form["songs_order"]

    orig = set(playlist.songs)
    new = set([Song.query.get(id) for id in json.loads(playlist.songs_order)])

    songs_to_remove = orig - new
    songs_to_add = new - orig

    def remove_song(song):
      delete_stmt = playlist_song.delete().where(playlist_song.c.playlist_id == id).where(playlist_song.c.song_id == song.id)
      db.session.execute(delete_stmt)
    
    for song in songs_to_remove:
      remove_song(song)
    db.session.commit()

    def add_song(song):
      insert_stmt = playlist_song.insert().values(playlist_id=id, song_id=song.id)
      db.session.execute(insert_stmt)

    for song in songs_to_add:
      add_song(song)
    db.session.commit()

    playlist.description = request.form["description"]
    playlist.updated_at = datetime.now()
    db.session.commit()
    return playlist.to_extended_dict()
  else:
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


# GET /api/playlists/
@playlist_routes.route('/')
def get_all_playlists():
  """
  Get All Playlists
  """
  playlists = Playlist.query.all()
  return jsonify([playlist.to_dict() for playlist in playlists])


# GET /api/playlists/:id
@playlist_routes.route('/<uuid:id>')
def get_playlist(id):
  """
  Get playlist by id
  """
  playlist = Playlist.query.get(id)
  if playlist:
    song_ids = [str(song.id) for song in playlist.songs]
    songs_order = json.loads(playlist.songs_order)
    songs_order = [id for id in songs_order if id in song_ids]
    playlist.songs_order = json.dumps(songs_order)
    db.session.commit()

    return playlist.to_extended_dict()
  else:
    return not_found_error('playlist')


# DELETE /api/playlists/:id
@playlist_routes.route('/<uuid:id>', methods=['DELETE'])
@login_required
def delete_playlist(id):
  """
  Delete Playlist of id
  """
  playlist = Playlist.query.get(id)
  if not playlist:
    return not_found_error('playlist')

  if current_user.id != playlist.user_id:
    return UNAUTHORIZED_ERROR

  db.session.delete(playlist)
  db.session.commit()
  return {'id': id}


# POST /api/playlists/:id/toggleLike
@playlist_routes.route('/<uuid:id>/toggleLike', methods=['POST'])
@login_required
def toggle_like_playlist(id):
  """
  Toggle Like on a Playlist
  """
  form = PlaylistToggleLikeForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    playlist = Playlist.query.get(id)
    user = User.query.get(request.form['user_id'])

    if not playlist:
      return not_found_error('playlist')
    if not user:
      return not_found_error('user')

    if current_user.id != user.id:
      return UNAUTHORIZED_ERROR

    if user not in playlist.pl_likes:
      playlist.pl_likes.append(user)
    else:
      playlist.pl_likes.remove(user)

    db.session.commit()
    return playlist.to_extended_dict()
