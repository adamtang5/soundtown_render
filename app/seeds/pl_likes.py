import math, random

from app.models import db, Playlist, User

MIN_PCT_PL_LIKED_BY_USER = 0.4
MAX_PCT_PL_LIKED_BY_USER = 0.7

def seed_pl_likes():
  users = User.query.all()

  for user in users:
    playlists = Playlist.query.filter(Playlist.user_id != user.id).all()
    random_pls = random.sample(
      playlists,
      random.randint(
        math.floor(len(playlists)*MIN_PCT_PL_LIKED_BY_USER),
        math.ceil(len(playlists)*MAX_PCT_PL_LIKED_BY_USER)
      )
    )
    for pl in random_pls:
      pl.pl_likes.append(user)

    db.session.commit()


def undo_pl_likes():
  db.session.execute('TRUNCATE playlist_likes RESTART IDENTITY CASCADE;')
  db.session.commit()
