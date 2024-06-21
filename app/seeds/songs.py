import json
import os
import random

from app.models import db, Song, User


def seed_songs():
  user_ids = [user.id for user in User.query.all()]
  with open(os.getcwd()+"/app/seeds/songs.json") as f:
    data = json.load(f)

    for song_dict in data['songs']:
      new_song = Song(
        user_id=random.choice(user_ids),
        title=song_dict["title"],
        audio_url=song_dict["audio_url"],
        description=song_dict["description"],
        image_url=song_dict["image_url"],
        play_count=random.randint(50, 5000))
      db.session.add(new_song)

    db.session.commit()


def undo_songs():
  db.session.execute('TRUNCATE songs RESTART IDENTITY CASCADE;')
  db.session.commit()
