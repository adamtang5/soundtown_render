from .db import db
from sqlalchemy.dialect.postgresql import UUID


comment_likes = db.Table(
    "comment_likes",
    db.Column("user_id", UUID(as_uuid=True), db.ForeignKey("users.id"), primary_key=True),
    db.Column("comment_id", UUID(as_uuid=True), db.ForeignKey("comments.id"), primary_key=True)
)
