from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import User, db
from datetime import datetime
from app.api.utils import validation_errors_to_error_messages
from app.s3_helpers import (
  upload_file_to_s3, allowed_file, get_unique_filename
)

user_routes = Blueprint('users', __name__)

# GET /api/users/
@user_routes.route('/')
# @login_required
def users():
  users = User.query.all()
  return jsonify([user.to_dict() for user in users])

# GET /api/users/:id
@user_routes.route('/<int:id>')
@login_required
def user(id):
  user = User.query.get(id)
  return user.to_dict()

# PUT /api/users/:id
@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def edit_user(id):
  """
  Edit User Details
  """
  FILE_TYPE_ERROR = jsonify({"error": "file type not permitted"}), 400
  user = User.query.get(id)
  if not user:
    return jsonify({"error": "user not found"}), 404

  if current_user.id != id:
    return jsonify({"error": "unauthorized"}), 403

  display_name = request.form.get('display_name', "")
  raw_avatar_url = request.form.get('avatar_url', None)
  raw_banner_url = request.form.get('banner_url', None)

  if raw_avatar_url:
    if not allowed_file(raw_avatar_url.filename):
      return FILE_TYPE_ERROR

    raw_avatar_url.filename = get_unique_filename(raw_avatar_url.filename)
    avatar_upload = upload_file_to_s3(raw_avatar_url)
    user.avatar_url = avatar_upload['url']

  if raw_banner_url:
    if not allowed_file(raw_banner_url.filename):
      return FILE_TYPE_ERROR

    raw_banner_url.filename = get_unique_filename(raw_banner_url.filename)
    banner_upload = upload_file_to_s3(raw_banner_url)
    user.banner_url = banner_upload['url']

  if display_name is not None:
    user.display_name = display_name

  user.updated_at = datetime.now()
  db.session.commit()
  return user.to_dict()
