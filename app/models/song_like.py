from .db import db
from sqlalchemy.dialects.postgresql import UUID


song_likes = db.Table(
  "song_likes",
  db.Column("user_id", UUID(as_uuid=True), db.ForeignKey("users.id"), primary_key=True),
  db.Column("song_id", UUID(as_uuid=True), db.ForeignKey("songs.id"), primary_key=True)
)
