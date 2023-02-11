from .db import db
from datetime import datetime
from .playlist_like import playlist_likes
from .playlist_song import playlist_song
import json


class Playlist(db.Model):
  __tablename__ = 'playlists'

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
  title = db.Column(db.String(75), nullable=False)
  songs_order = db.Column(db.Text, nullable=False, default="[]")
  image_url = db.Column(db.String)
  description = db.Column(db.String)
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

  def to_dict(self):
    return {
      'id': self.id,
      'user_id': self.user_id,
      'user': self.user.to_dict(),
      'title': self.title,
      'songs_order': json.loads(f'[{self.songs_order}]'),
      'image_url': self.image_url,
      'description': self.description,
      'created_at': self.created_at,
      'updated_at': self.updated_at,
      'songs': [song.id for song in self.songs],
      'likes': [like.id for like in self.pl_likes]
    }
