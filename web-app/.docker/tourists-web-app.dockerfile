FROM nginx:latest

MAINTAINER Francisco Mercedes

RUN apt-get update
RUN apt-get install gnupg --assume-yes
RUN apt-get install curl --assume-yes
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash 
RUN apt-get install -yq nodejs build-essential
RUN npm install -g @angular/cli

COPY "./distribution" "/usr/share/nginx/html"