FROM node:17-alpine

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000 

RUN npm install -g nodemon

CMD [ "nodemon", "app.js" ]