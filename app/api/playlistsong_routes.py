from flask import Blueprint,request
from flask_login import current_user, login_required
from app.models import db, Song, Playlist, User
from sqlalchemy.orm import relationship, sessionmaker, joinedload

playlistsong_routes = Blueprint('playlistsong',__name__)

# POST /api/playlistsongs/
@playlistsong_routes.route('/', methods=['POST'])
@login_required
def add_song_to_playlist():
  """
  Add a song to playlist
  """
  playlist_id = request.form["playlist_id"]
  song_id = request.form["song_id"]

  song = Song.query.get(int(song_id))
  playlist = Playlist.query.get(int(playlist_id))

  playlist.songs.append(song)

  db.session.commit()

  return playlist.to_dict()


@playlistsong_routes.route('/', methods=['DELETE'])
@login_required
def delete_song_from_playlist():
  """
  Remove a song from playlist
  """
  playlist_id = request.form["playlist_id"]
  song_id = request.form["song_id"]

  song = Song.query.get(int(song_id))
  playlist = Playlist.query.get(int(playlist_id))

  playlist.songs.remove(song)

  db.session.commit()

  return playlist.to_dict()
