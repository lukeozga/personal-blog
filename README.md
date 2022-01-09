# personal-blog
Personal blog application written in Node.js and Express.js. Application uses EJS as view engine.

## Development setup
For convenience, application has been containerized. This makes setting up of development environment much easier:

* Create `.env` file in root directory with the following enviroment variables (see `.example-env`):
    * PORT=<port_an_application_will_listen_on>
    * DB_URL=<mongodb_url> (default: DB_URL=mongodb://mongo:27017/blogDB)
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