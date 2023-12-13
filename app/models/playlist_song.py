from .db import db
from sqlalchemy.dialect.postgresql import UUID


playlist_song = db.Table(
  "playlists_songs",
  db.Column("playlist_id", UUID(as_uuid=True), db.ForeignKey("playlists.id"), primary_key=True),
  db.Column("song_id", UUID(as_uuid=True), db.ForeignKey("songs.id"), primary_key=True)
)
