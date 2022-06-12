# personal-blog
Personal blog application written in Node.js and Express.js. Application uses EJS as view engine.

## Development setup
For convenience, application has been containerized. This makes setting up of development environment much easier. To set up development environment run:

```
npm run dev-server
```
This command will:

* Install required dependencies locally
* Navigate to `docker` directory
* Run docker-compose command to bring the service up

To bring service down run:

```
docker-compose down
```

Root directory is automatically mapped to `/app` directory inside container which allows to make chnages and get instant feedback:

* Any chnages to app.js file will trigger restart of node application
* Any template changes require refresh in a browser to become visible

During build and initial setup the following things happen:
* application image is built 
* mongo image is pulled locally
* both containers start
* root database user for mongodb is created in `admin` db:
    * username: root
    * password: root
* application user with read/write access to `blogDB` database is created in `admin` db:
    * username: blogapp
    * password: blogapp
* `users` and `sessions` collection is created
* test user is created in `users` collection inside `blogDB` for website login and testing:
    * username: testuser@test.com
    * password: test

Application is accessible under following address: http://127.0.0.1:3000/

To access database directly in container run:
```
docker exec -it mongo mongo admin -u root -p root
```

## Authentication
Application supports simple authentication mechanism implemented with express-session middleware. Upon successful login, user session is being created. Default session duration is 10 minutes or until logged out. 

Sessions are stored in `blogDB` in `sessions` collection. The connection uses `connect-mongo` library which allows to utilize existing connection to setup sessions store. Sessions are encrypted at rest with AES256.
