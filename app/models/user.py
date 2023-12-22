from .db import db
from sqlalchemy.dialects.postgresql import UUID
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .song_like import song_likes
from .playlist_like import playlist_likes
from .comment_like import comment_likes
from datetime import datetime
import uuid


class User(db.Model, UserMixin):
  __tablename__ = 'users'

  id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  email = db.Column(db.String(255), nullable=False, unique=True)
  hashed_password = db.Column(db.String(255), nullable=False)
  display_name = db.Column(db.String(50), nullable=False)
  avatar_url = db.Column(db.String)
  banner_url = db.Column(db.String)
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

  songs = db.relationship("Song", back_populates="user", cascade="all, delete")
  playlists = db.relationship("Playlist", back_populates="user", cascade="all, delete")
  comments = db.relationship("Comment", back_populates="user", cascade="all, delete")

  pl_likes = db.relationship(
    "Playlist",
    secondary=playlist_likes,
    back_populates="pl_likes"
  )

  comment_likes = db.relationship(
    "Comment",
    secondary=comment_likes,
    back_populates="comment_likes"
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

  def to_extended_dict(self):
    return {
      'id': self.id,
      'email': self.email,
      'display_name': self.display_name,
      'avatar_url': self.avatar_url,
      'banner_url': self.banner_url,
      'created_at': self.created_at,
      'updated_at': self.updated_at,
      'songs': [song.to_dict() for song in self.songs],
      'playlists': [pl.to_dict() for pl in self.playlists],
      'likes': [song.id for song in self.likes],
      'pl_likes': [pl.id for pl in self.pl_likes],
      'comment_likes': [comment.id for comment in self.comment_likes]
    }
  
  def to_dict(self):
    return {
      'id': self.id,
      'display_name': self.display_name,
      'avatar_url': self.avatar_url
    }
