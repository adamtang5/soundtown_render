from app.models import db, User


# Adds a demo user, you can add other users here if you want
def seed_users():
  demo = User(
    email='demo@aa.io',
    display_name='Demo user',
    avatar_url='https://avatarfiles.alphacoders.com/194/thumb-194221.jpg',
    banner_url='https://i.ytimg.com/vi/zob-2dpRtH0/maxresdefault.jpg',
    password='password')
  marnie = User(
    email='marnie@aa.io',
    display_name='Marnie Bernard',
    avatar_url='https://avatarfiles.alphacoders.com/126/thumb-126015.png',
    banner_url='https://initiate.alphacoders.com/images/520/cropped-1400-425-520087.jpg?3614',
    password='password')
  bobbie = User(
    email='bobbie@aa.io',
    display_name='Bobby Bernard',
    avatar_url='https://avatarfiles.alphacoders.com/328/thumb-328691.jpg',
    banner_url='https://initiate.alphacoders.com/images/112/cropped-851-315-112449.jpg?6836',
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
