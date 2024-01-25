from .db import db
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from .song_like import song_likes
from .playlist_song import playlist_song
import uuid


class Song(db.Model):
  __tablename__ = 'songs'

  id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
  title = db.Column(db.String(75), nullable=False)
  audio_url = db.Column(db.String, nullable=False)
  description = db.Column(db.Text)
  image_url = db.Column(db.String)
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

  user = db.relationship("User", back_populates="songs")
  comments = db.relationship("Comment", back_populates="song", cascade="all, delete")

  likes = db.relationship(
    "User",
    secondary=song_likes,
    back_populates="likes"
  )

  playlists = db.relationship(
    "Playlist",
    secondary=playlist_song,
    back_populates="songs"
  )

  def to_extended_dict(self):
    return {
      'id': self.id,
      'user_id': self.user_id,
      'user': self.user.to_dict(),
      'title': self.title,
      'audio_url': self.audio_url,
      'description': self.description,
      'image_url': self.image_url,
      'comments': sorted([comment.to_dict() for comment in self.comments], key=lambda comment: comment['created_at']),
      'playlists': sorted([pl.to_dict() for pl in self.playlists], key=lambda pl: pl['id']),
      'created_at': self.created_at,
      'updated_at': self.updated_at,
      'likes': [like.id for like in self.likes]
    }

  def to_dict(self):
    return {
      'id': self.id,
      'user_id': self.user_id,
      'title': self.title,
      'audio_url': self.audio_url,
      'description': self.description,
      'image_url': self.image_url,
      'likes': [like.id for like in self.likes]
    }