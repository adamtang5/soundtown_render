from .db import db
from sqlalchemy.dialect.postgresql import UUID


playlist_likes = db.Table(
  "playlist_likes",
  db.Column("user_id", UUID(as_uuid=True), db.ForeignKey("users.id"), primary_key=True),
  db.Column("playlist_id", UUID(as_uuid=True), db.ForeignKey("playlists.id"), primary_key=True)
)
