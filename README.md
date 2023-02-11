# Sound Town
<div align="center"><a href="https://soundtown.onrender.com/">
<img src="https://github.com/adamtang5/soundtown_render/blob/main/react-app/src/static/images/logo/SoundTown-icon-with-text-transparent-bg.png?raw=true" height=200 /></a></div>

This is a clone of [Soundcloud](https://soundcloud.com/). Access the [Sound Town MVP](https://soundtown.onrender.com/).

**Sound Town** is the place to go to share music and listen to music uploaded by others.

# Index
|
[MVP Feature List](https://github.com/adamtang5/soundtown_render/wiki/MVP-Feature-List) |
[User Stories and Acceptance Criteria](https://github.com/adamtang5/soundtown_render/wiki/User-Stories-and-Acceptance-Criteria) |
[Database Schema](https://github.com/adamtang5/soundtown_render/wiki/Database-Schema) |
[Redux State Shape](https://github.com/adamtang5/soundtown_render/wiki/Redux-State-Shape) |
[API Documentation](https://github.com/adamtang5/soundtown_render/wiki/API-Documentation) |
[Frontend Routes](https://github.com/adamtang5/soundtown_render/wiki/Frontend-Routes) |


# Technologies Used
<img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/javascript/javascript-original.svg" alt="javascript" title="javascript" height=40 /><img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/react/react-original.svg" alt="react" title="react" height=40 /><img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/redux/redux-original.svg" alt="redux" title="redux" height=40 /><img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/nodejs/nodejs-plain-wordmark.svg" alt="node.js" title="node.js" height=40 /><img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/python/python-original-wordmark.svg" alt="python" title="python" height=40 /><img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/flask/flask-original-wordmark.svg" alt="flask" title="flask" height=40 /><img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/postgresql/postgresql-original.svg" alt="postgresql" title="postgresql" height=40 /><img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/sqlalchemy/sqlalchemy-original-wordmark.svg" alt="sqlalchemy" title="sqlalchemy" height=40 /><img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/css3/css3-original.svg" alt="css3" title="css3" height=40 /><img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/html5/html5-original.svg" alt="html5" title="html5" height=40 /><img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/git/git-original.svg" alt="git" title="git" height=40 /><img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" alt="amazon web services" title="amazon web services" height=40 /><img src="https://github.com/devicons/devicon/blob/v2.15.1/icons/vscode/vscode-original.svg" alt="visual studio code" title="visual studio code" height=40 />


# Getting started

1. Clone this repo.

    * ```git clone git@github.com:adamtang5/soundtown_heroku.git```

2. Install dependencies.

    * ```pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt```

3. Create a `.env` file based on `.env.example*` with proper settings required for the development environment.

4. Create a POSTGRESQL user with CREATEDB and PASSWORD in PSQL.

    * ```CREATE USER <db_username> WITH CREATEDB PASSWORD <'db_password'>;```
    * ```CREATE DATABASE <db_name> WITH OWNER <db_username>;```

5. Follow [these instructions](https://github.com/jamesurobertson/aws-s3-pern-demo#create-your-aws-user-and-bucket) to create your aws user and bucket, and obtain your credentials (stop after the __Create your AWS User and Bucket__ section). You will need these credentials in subsequent steps to set up your environment.

6. Enter your username and password information into your .env file along with your desired database name, a secured combination of characters for your SECRET_KEY, and enter the credentials for AWS S3 from the previous step.

7. Get into pipenv, migrate the database, seed the database, and run the flask app using the following commands:

    * ```pipenv shell```
    * ```flask db migrate```
    * ```flask seed all```
    * ```flask run```

8. Install frontend dependencies in the `react-app` directory.

    * ```npm install```

9. Start the frontend React app.

    * ```npm start```

10. You can use the Demo user or create an account to begin using **Sound Town**.

# Features

Logged in users can perform the following actions.

 - Add/View/Edit/Delete Songs
 - Add/View/Edit/Delete Comments
