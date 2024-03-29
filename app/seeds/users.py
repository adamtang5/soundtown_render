from app.models import db, User


# Adds a demo user, you can add other users here if you want
def seed_users():
  demo = User(
    email='demo@aa.io',
    display_name='Demo user',
    avatar_url='https://i.ibb.co/Qb79Y9g/eighth-note-sq.png',
    banner_url='https://i.ytimg.com/vi/zob-2dpRtH0/maxresdefault.jpg',
    password='password')
  marnie = User(
    email='marnie@aa.io',
    display_name='Marnie Bernard',
    avatar_url='https://avatarfiles.alphacoders.com/368/thumb-368605.jpg',
    banner_url='https://images.unsplash.com/photo-1551193541-5937ec516252?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2067&q=80',
    password='password')
  bobbie = User(
    email='bobbie@aa.io',
    display_name='Bobby Bernard',
    avatar_url='https://avatarfiles.alphacoders.com/328/thumb-328691.jpg',
    banner_url='https://images.unsplash.com/photo-1504892612018-159ffa1d147f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    password='password')

  db.session.add(demo)
  db.session.add(marnie)
  db.session.add(bobbie)

  db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
  db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
  db.session.commit()
