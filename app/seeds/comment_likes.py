import math, random

from app.models import db, Comment, User

MIN_PCT_COMMENTS_LIKED_BY_USER = 0.3
MAX_PCT_COMMENTS_LIKED_BY_USER = 0.6


def seed_comment_likes():
  users = User.query.all()
  comments = Comment.query.all()

  for user in users:
    random_comments = random.sample(
      comments,
      random.randint(
        math.floor(len(comments)*MIN_PCT_COMMENTS_LIKED_BY_USER),
        math.ceil(len(comments) * MAX_PCT_COMMENTS_LIKED_BY_USER)
      )
    )
    for comment in random_comments:
      comment.comment_likes.append(user)

    db.session.commit()


def undo_comment_likes():
  db.session.execute('TRUNCATE comment_likes RESTART IDENTITY CASCADE;')
  db.session.commit()
