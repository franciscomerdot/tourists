FROM node:latest

MAINTAINER Francisco Mercedes

ENV PORT=80

COPY "./source" "/var/www/tourists-web-api/source"
COPY "./package.json" "/var/www/tourists-web-api/"

WORKDIR "/var/www/tourists-web-api"

RUN npm install nodemon@1.10.0 -g
RUN npm install

EXPOSE $PORT

ENTRYPOINT ["npm", "run" ,"start"] 