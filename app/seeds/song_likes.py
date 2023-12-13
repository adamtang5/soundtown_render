import random

from app.models import db, Song, User

MIN_PCT_SONGS_LIKED_BY_USER = 0.4
MAX_PCT_SONGS_LIKED_BY_USER = 0.7

def seed_likes():
  users = User.query.all()
  songs = Song.query.all()

  for user in users:
    random_songs = random.sample(songs, random.randint(len(songs) * MIN_PCT_SONGS_LIKED_BY_USER, len(songs) * MAX_PCT_SONGS_LIKED_BY_USER))
    for song in random_songs:
      song.likes.append(user)

  db.session.commit()


def undo_likes():
  db.session.execute('TRUNCATE song_likes RESTART IDENTITY CASCADE;')
  db.session.commit()
