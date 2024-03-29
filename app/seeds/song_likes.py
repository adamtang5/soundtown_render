import math, random

from app.models import db, Song, User

MIN_PCT_SONGS_LIKED_BY_USER = 0.4
MAX_PCT_SONGS_LIKED_BY_USER = 0.7

def seed_likes():
  users = User.query.all()

  for user in users:
    songs = Song.query.filter(Song.user_id != user.id).all()
    random_songs = random.sample(
      songs,
      random.randint(
        math.floor(len(songs)*MIN_PCT_SONGS_LIKED_BY_USER),
        math.ceil(len(songs)*MAX_PCT_SONGS_LIKED_BY_USER)
      )
    )
    for song in random_songs:
      song.likes.append(user)

  db.session.commit()


def undo_likes():
  db.session.execute('TRUNCATE song_likes RESTART IDENTITY CASCADE;')
  db.session.commit()
