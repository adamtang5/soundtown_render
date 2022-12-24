from .db import db


song_likes = db.Table(
  "songs_likes",
  db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
  db.Column("song_id", db.Integer, db.ForeignKey("songs.id"), primary_key=True)
)
