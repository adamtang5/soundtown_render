from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import text
from app.models import db, User, Playlist, Song, playlist_song
from datetime import datetime
from app.forms import NewPlaylistForm, EditPlaylistForm
from app.api.utils import (
  validation_errors_to_error_messages,
  not_found_error,
  FILE_TYPE_ERROR,
  UNAUTHORIZED_ERROR
)
from app.s3_helpers import (
  upload_file_to_s3, allowed_file, get_unique_filename
)
from sqlalchemy.orm import relationship, sessionmaker, joinedload
import json

playlist_routes = Blueprint('playlist',__name__)


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

    playlist = Playlist.query.order_by(text("id desc")).limit(1).one()
    for song_id in json.loads(request.form['songs_order']):
      song = Song.query.get(song_id)
      playlist.songs.append(song)

    db.session.commit()
    return playlist.to_dict()
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
      return jsonify({"errors": ["playlist not found"]}), 404

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
    ids_to_remove = [song.id for song in (orig - new)]
    songs_to_add = new - orig

    playlist_song.query.filter_by(playlist_id=id).filter(playlist_song.user_id.in_(ids_to_remove)).delete()
    db.session.commit()

    def add_song(song):
      db.session.add(playlist_song(playlist_id=id, song_id=song.id))

    for song in songs_to_add:
      add_song(song)
    db.session.commit()

    playlist.description = request.form["description"]
    playlist.updated_at = datetime.now()
    db.session.commit()
    return playlist.to_dict()
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
  return playlist.to_extended_dict()


# DELETE /api/playlists/:id
@playlist_routes.route('/<uuid:id>',methods=['DELETE'])
@login_required
def delete_playlist(id):
  """
  Delete playlist by id
  """
  playlist = Playlist.query.get(id)
  if playlist:
    db.session.delete(playlist)
    db.session.commit()
    return {"id":id}
  else:
    return not_found_error('playlist')
