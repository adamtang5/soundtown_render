from .db import db


playlist_likes = db.Table(
  "playlist_likes",
  db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
  db.Column("playlist_id", db.Integer, db.ForeignKey("playlists.id"), primary_key=True)
)
