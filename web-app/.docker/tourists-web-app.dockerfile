FROM nginx:latest

MAINTAINER Francisco Mercedes

ENV PORT=80

COPY "./distribution" "/usr/share/nginx/html"

EXPOSE $PORT