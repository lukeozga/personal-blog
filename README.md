# personal-blog
Personal blog application written in Node.js and Express.js. Application uses EJS as view engine.

## Development setup
For convenience, application has been containerized. This makes setting up of development environment much easier. To set up development environment:

* Navigate to `docker` directory:
    ```
    cd docker
    ```
* Run docker-compose command to bring the service up and down:
    ```
    docker-compose up
    ```
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
* test user is created in `users` collection inside `blogDB` for website login and testing:
    * username: testuser@test.com
    * password: test

Application is accessible under following address: http://127.0.0.1:3000/

To access database directly in container run:
```
docker exec -it mongo mongo admin -u root -p root
```