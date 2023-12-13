import math
import random

from app.models import db, User, Song, Comment
from faker import Faker

faker = Faker('en_US')

PCT_SONGS_WITH_COMMENTS = 0.8
PCT_ROOT_COMMENTS_WITH_NESTED_COMMENTS = 0.6
MAX_INITIAL_NESTED_COMMENTS = 4

def seed_root_comments():
  user_ids = [user.id for user in User.query.all()]
  song_ids = [song.id for song in Song.query.all()]
  num_songs = len(song_ids)

  random_song_ids = random.sample(song_ids, math.floor(num_songs * PCT_SONGS_WITH_COMMENTS))
  for song_id in random_song_ids:
    for _ in range(random.randint(1, 10)):
      new_comment = Comment(
        user_id=random.choice(user_ids),
        song_id=song_id,
        message=faker.sentence(),
      )
      db.session.add(new_comment)

  db.session.commit()


def seed_nested_comments():
  user_ids = [user.id for user in User.query.all()]
  root_comments = Comment.query.all()
  random_root_comments = random.sample(
    root_comments,
    math.floor(len(root_comments)*PCT_ROOT_COMMENTS_WITH_NESTED_COMMENTS)
  )
  for comment in random_root_comments:
    for _ in range(random.randint(1, MAX_INITIAL_NESTED_COMMENTS)):
      new_comment = Comment(
        user_id=random.choice(user_ids),
        song_id=comment.song_id,
        parent_id=comment.id,
        message=faker.sentence(),
      )
      db.session.add(new_comment)

  db.session.commit()


def undo_comments():
  db.session.execute('TRUNCATE comments RESTART IDENTITY CASCADE;')
  db.session.commit()
