from .db import db
from sqlalchemy.dialects.postgresql import UUID
from .comment_like import comment_likes
from datetime import datetime
import uuid


class Comment(db.Model):
  __tablename__ = 'comments'

  id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  message = db.Column(db.Text, nullable=False)
  user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
  song_id = db.Column(UUID(as_uuid=True), db.ForeignKey("songs.id"), nullable=False)
  parent_id = db.Column(UUID(as_uuid=True), db.ForeignKey("comments.id"), nullable=True)
  song_timestamp = db.Column(db.Time)
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
  updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

  user = db.relationship("User", back_populates="comments")
  song = db.relationship("Song", back_populates="comments")
  children = db.relationship("Comment", backref=db.backref("comments", remote_side=[id]), cascade="all, delete")

  comment_likes = db.relationship(
    "User",
    secondary=comment_likes,
    back_populates="comment_likes"
  )

  def to_dict(self):
    return {
      'id': self.id,
      'user_id': self.user_id,
      'user': self.user.to_dict(),
      'message': self.message,
      'song_id': self.song_id,
      'parent_id': self.parent_id,
      'song_timestamp': self.song_timestamp,
      'created_at': self.created_at,
      'updated_at': self.updated_at,
      'children': [comment.id for comment in self.children],
      'likes': [like.id for like in self.comment_likes]
    }
