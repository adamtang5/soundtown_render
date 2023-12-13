import json
import os
import random

from sqlalchemy import text
from app.models import db, Playlist, User, Song

MIN_PL_LEN = 4
MAX_PL_LEN = 15

def seed_playlists():
  user_ids = [user.id for user in User.query.all()]
  song_ids = [str(song.id) for song in Song.query.all()]

  with open(os.getcwd()+"/app/seeds/playlists.json") as f:
    data = json.load(f)

    for playlist_dict in data:
      songs_order = random.sample(song_ids, random.randint(MIN_PL_LEN, MAX_PL_LEN))

      new_playlist = Playlist(
        user_id=random.choice(user_ids),
        title=playlist_dict["title"],
        songs_order=json.dumps(songs_order),
        image_url=playlist_dict["image_url"],
        description=playlist_dict["description"])
      db.session.add(new_playlist)

      playlist = Playlist.query.order_by(text("id desc")).limit(1).one()
      for song_id in songs_order:
        song = Song.query.get(song_id)
        playlist.songs.append(song)

    db.session.commit()


def undo_playlists():
  db.session.execute('TRUNCATE playlists_songs RESTART IDENTITY CASCADE;')
  db.session.execute('TRUNCATE playlists RESTART IDENTITY CASCADE;')
  db.session.commit()
