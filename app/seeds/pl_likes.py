import random

from app.models import db, Playlist, User


def seed_pl_likes():
  num_playlists = len(Playlist.query.all())
  num_users = len(User.query.all())
  for user_id in range(1, num_users+1):
    user = User.query.get(user_id)
    pl_ids = random.sample(range(1, num_playlists+1), num_playlists // (user_id+1))
    for pl_id in pl_ids:
      playlist = Playlist.query.get(pl_id)
      playlist.pl_likes.append(user)

    db.session.commit()


def undo_pl_likes():
  db.session.execute('TRUNCATE playlist_likes RESTART IDENTITY CASCADE;')
  db.session.commit()
