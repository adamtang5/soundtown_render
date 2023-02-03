from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db, Song, User, Playlist
from datetime import datetime
from sqlalchemy.orm import relationship, sessionmaker, joinedload

like_routes = Blueprint('like', __name__)

# POST /api/likes/song
@like_routes.route('/song', methods=['POST'])
@login_required
def like_song():
  """
  Create a New like on a song
  """
  user_id = request.form["user_id"]
  song_id = request.form["song_id"]

  song = Song.query.get(int(song_id))
  user = User.query.get(int(user_id))

  song.likes.append(user)

  db.session.commit()
  return song.to_dict()

# DELETE /api/likes/song
@like_routes.route('/song', methods=['DELETE'])
@login_required
def unlike_song():
  """
  Create a New like on a song
  """

  user_id = request.form["user_id"]
  song_id = request.form["song_id"]

  song = Song.query.get(int(song_id))
  user = User.query.get(int(user_id))

  song.likes = [like for like in song.likes if user.id != like.id]
  db.session.commit()
  return song.to_dict()

# POST /api/likes/playlist
@like_routes.route('/playlist', methods=['POST'])
@login_required
def like_playlist():
  """
  Create a New like on a playlist
  """
  user_id = request.form["user_id"]
  playlist_id = request.form["playlist_id"]

  playlist = Playlist.query.get(int(playlist_id))
  user = User.query.get(int(user_id))

  playlist.pl_likes.append(user)

  db.session.commit()
  return playlist.to_dict()

# DELETE /api/likes/playlist
@like_routes.route('/playlist', methods=['DELETE'])
@login_required
def unlike_playlist():
  """
  Create a New like on a playlist
  """
  user_id = request.form["user_id"]
  playlist_id = request.form["playlist_id"]

  playlist = Playlist.query.get(int(playlist_id))
  user = User.query.get(int(user_id))

  playlist.pl_likes = [like for like in playlist.pl_likes if user.id != like.id]
  db.session.commit()
  return playlist.to_dict()
