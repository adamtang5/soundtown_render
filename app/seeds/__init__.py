from flask.cli import AppGroup
from .users import seed_users, undo_users
from .songs import seed_songs, undo_songs
from .song_likes import seed_likes, undo_likes
from .comments import seed_root_comments, seed_nested_comments, undo_comments
from .playlists import seed_playlists, undo_playlists
from .pl_likes import seed_pl_likes, undo_pl_likes

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
  seed_users()
  seed_songs()
  seed_root_comments()
  seed_nested_comments()
  seed_likes()
  seed_playlists()
  seed_pl_likes()
  # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
  undo_pl_likes()
  undo_playlists()
  undo_likes()
  undo_comments()
  undo_songs()
  undo_users()
  # Add other undo functions here
