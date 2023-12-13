import random

from app.models import db, Playlist, User

MIN_PCT_PL_LIKED_BY_USER = 0.3
MAX_PCT_PL_LIKED_BY_USER = 0.5

def seed_pl_likes():
  users = User.query.all()
  playlists = Playlist.query.all()

  for user in users:
    random_pls = random.sample(playlists, random.randint(len(playlists) * MIN_PCT_PL_LIKED_BY_USER, len(playlists) * MAX_PCT_PL_LIKED_BY_USER))
    for pl in random_pls:
      pl.pl_likes.append(user)

    db.session.commit()


def undo_pl_likes():
  db.session.execute('TRUNCATE playlist_likes RESTART IDENTITY CASCADE;')
  db.session.commit()
