import math
import random

from app.models import db, User, Song, Comment
from faker import Faker

faker = Faker('en_US')


def seed_comments():
  user_ids = [user.id for user in User.query.all()]
  song_ids = [song.id for song in Song.query.all()]
  num_songs = len(song_ids)

  random_indices = random.sample(range(0, num_songs), math.floor(num_songs * 0.75))
  random_song_ids = [song_ids[idx] for idx in random_indices]
  for song_id in random_song_ids:
    for _ in range(random.randint(1, 10)):
      new_comment = Comment(
        user_id=user_ids[random.randint(0, len(user_ids)-1)],
        song_id=song_id,
        message=faker.sentence(),
      )
      db.session.add(new_comment)

  db.session.commit()


def undo_comments():
  db.session.execute('TRUNCATE comments RESTART IDENTITY CASCADE;')
  db.session.commit()
