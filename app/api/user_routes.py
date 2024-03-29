from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import User, db
from datetime import datetime
from app.forms import EditUserForm
from app.api.utils import (
  validation_errors_to_error_messages,
  not_found_error,
  FILE_TYPE_ERROR,
  UNAUTHORIZED_ERROR
)
from app.s3_helpers import (
  upload_file_to_s3, allowed_file, get_unique_filename
)

user_routes = Blueprint('users', __name__)


# GET /api/users/
@user_routes.route('/')
@login_required
def users():
  users = User.query.all()
  return jsonify([user.to_dict() for user in users])


# GET /api/users/:id
@user_routes.route('/<uuid:id>')
@login_required
def user(id):
  user = User.query.get(id)
  if user:
    return user.to_extended_dict()
  else:
    return not_found_error('user')


# PUT /api/users/:id
@user_routes.route('/<uuid:id>', methods=['PUT'])
@login_required
def edit_user(id):
  """
  Edit User
  """
  form = EditUserForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    user = User.query.get(id)
    if not user:
      return not_found_error('user')

    if current_user.id != id:
      return UNAUTHORIZED_ERROR

    raw_avatar_url = request.form.get('avatar_url')
    raw_avatar_file = request.files.get('avatar_url')
    raw_banner_url = request.form.get('banner_url')
    raw_banner_file = request.files.get('banner_url')

    if raw_avatar_url == '':
      user.avatar_url = ''
    elif raw_avatar_file:
      if not allowed_file(raw_avatar_file.filename):
        return FILE_TYPE_ERROR
      raw_avatar_file.filename = get_unique_filename(raw_avatar_file.filename)
      user.avatar_url = upload_file_to_s3(raw_avatar_file)['url']

    if raw_banner_url == '':
      user.banner_url = ''
    elif raw_banner_file:
      if not allowed_file(raw_banner_file.filename):
        return FILE_TYPE_ERROR
      raw_banner_file.filename = get_unique_filename(raw_banner_file.filename)
      user.banner_url = upload_file_to_s3(raw_banner_file)['url']

    user.display_name = request.form.get('display_name')
    user.updated_at = datetime.now()
    db.session.commit()
    return user.to_extended_dict()
  else:
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
