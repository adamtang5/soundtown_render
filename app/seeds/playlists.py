import json
import os
import random

from sqlalchemy import text
from app.models import db, Playlist, User, Song


def seed_playlists():
  num_users = len(User.query.all())
  num_songs = len(Song.query.all())

  with open(os.getcwd()+"/app/seeds/playlists.json") as f:
    data = json.load(f)

    for playlist_dict in data:
      songs_order = random.sample(range(1, num_songs+1), random.randint(4, 15))

      new_playlist = Playlist(
        user_id=random.randint(1, num_users),
        title=playlist_dict["title"],
        songs_order=json.dumps(songs_order),
        image_url=playlist_dict["image_url"],
        description=playlist_dict["description"])
      db.session.add(new_playlist)

      for song_id in songs_order:
        song = Song.query.get(song_id)
        playlist = Playlist.query.order_by(text("id desc")).limit(1).one()
        playlist.songs.append(song)

    db.session.commit()


def undo_playlists():
  db.session.execute('TRUNCATE playlists_songs RESTART IDENTITY CASCADE;')
  db.session.execute('TRUNCATE playlists RESTART IDENTITY CASCADE;')
  db.session.commit()
