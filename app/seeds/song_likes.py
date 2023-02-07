import random

from app.models import db, Song, User


def seed_likes():
  num_songs = len(Song.query.all())
  num_users = len(User.query.all())
  for user_id in range(1, num_users+1):
    user = User.query.get(user_id)
    song_ids = random.sample(range(1, num_songs+1), num_songs // (user_id+1))
    for song_id in song_ids:
      song = Song.query.get(song_id)
      song.likes.append(user)

  db.session.commit()


def undo_likes():
  db.session.execute('TRUNCATE song_likes RESTART IDENTITY CASCADE;')
  db.session.commit()
