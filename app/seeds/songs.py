import json
import os
import random

from app.models import db, Song, User


def seed_songs():
  num_users = len(User.query.all())
  with open(os.getcwd()+"/app/seeds/songs.json") as f:
    data = json.load(f)

    for song_dict in data['songs']:
      new_song = Song(
        user_id=random.randint(1, num_users),
        title=song_dict["title"],
        audio_url=song_dict["audio_url"],
        description=song_dict["description"],
        image_url=song_dict["image_url"])
      db.session.add(new_song)

    db.session.commit()


def undo_songs():
  db.session.execute('TRUNCATE songs RESTART IDENTITY CASCADE;')
  db.session.commit()
