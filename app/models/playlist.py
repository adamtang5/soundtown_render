from .db import db
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from .playlist_like import playlist_likes
from .playlist_song import playlist_song
import json
import uuid


class Playlist(db.Model):
  __tablename__ = 'playlists'

  id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
  title = db.Column(db.String(75), nullable=False)
  songs_order = db.Column(db.Text, nullable=False, default="[]")
  image_url = db.Column(db.String)
  description = db.Column(db.Text)
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

  user = db.relationship("User", back_populates="playlists")

  pl_likes = db.relationship(
    "User",
    secondary=playlist_likes,
    back_populates="pl_likes"
  )

  songs = db.relationship(
    "Song",
    secondary=playlist_song,
    back_populates="playlists"
  )

  def sort_by_id(self):
    d = dict()
    for item in self.songs:
      d[str(item.id)] = item
    return [d[id].to_dict() for id in json.loads(self.songs_order)]

  def normalized_likes(self):
    ans = dict()
    for user in self.pl_likes:
      ans[str(user.id)] = user.to_dict()
    return ans

  def to_extended_dict(self):
    return {
      'id': self.id,
      'user_id': self.user_id,
      'user': self.user.to_dict(),
      'title': self.title,
      'songs_order': json.loads(self.songs_order),
      'image_url': self.image_url,
      'description': self.description,
      'created_at': self.created_at,
      'updated_at': self.updated_at,
      'songs': self.sort_by_id(),
      'likes': self.normalized_likes()
    }

  def to_dict(self):
    return {
      'id': self.id,
      'user_id': self.user_id,
      'title': self.title,
      'songs_order': json.loads(self.songs_order),
      'image_url': self.image_url,
      'description': self.description,
      'likes': self.normalized_likes()
    }