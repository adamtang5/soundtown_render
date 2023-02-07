import math
import random

from app.models import db, User, Song, Comment
from faker import Faker

faker = Faker('en_US')


def seed_comments():
  users = User.query.all()
  num_users = len(users)
  num_songs = len(Song.query.all())

  random_song_ids = random.sample(range(1, num_songs+1), math.floor(num_songs * 0.75))
  for song_id in random_song_ids:
    for _ in range(random.randint(1, 10)):
      new_comment = Comment(
        user_id=random.randint(1, num_users),
        song_id=song_id,
        content=faker.sentence(),
      )
      db.session.add(new_comment)

  db.session.commit()


def undo_comments():
  db.session.execute('TRUNCATE comments RESTART IDENTITY CASCADE;')
  db.session.commit()
