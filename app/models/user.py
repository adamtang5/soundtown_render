from .db import db
from sqlalchemy.dialect.postgresql import UUID
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .song_like import song_likes
from .playlist_like import playlist_likes
from datetime import datetime
import uuid


class User(db.Model, UserMixin):
  __tablename__ = 'users'

  id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  email = db.Column(db.String(255), nullable=False, unique=True)
  hashed_password = db.Column(db.String(255), nullable=False)
  display_name = db.Column(db.String(50))
  avatar_url = db.Column(db.String)
  banner_url = db.Column(db.String)
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

  songs = db.relationship("Song", back_populates="user")
  playlists = db.relationship("Playlist", back_populates="user")
  comments = db.relationship("Comment", back_populates="user")

  pl_likes = db.relationship(
    "Playlist",
    secondary=playlist_likes,
    back_populates="pl_likes"
  )

  likes = db.relationship(
    "Song",
    secondary=song_likes,
    back_populates="likes"
  )

  @property
  def password(self):
    return self.hashed_password

  @password.setter
  def password(self, password):
    self.hashed_password = generate_password_hash(password)

  def check_password(self, password):
    return check_password_hash(self.password, password)

  def to_dict(self):
    return {
      'id': self.id,
      'email': self.email,
      'display_name': self.display_name,
      'avatar_url': self.avatar_url,
      'banner_url': self.banner_url,
      'created_at': self.created_at,
      'updated_at': self.updated_at,
      "comment_amount": len(self.comments),
      "likes": [song.id for song in self.likes]
    }
