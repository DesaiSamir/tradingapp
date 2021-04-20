FROM node:lts AS development

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    less \
    nano \
    mysql-server 

RUN mkdir -p /root/docker
COPY docker/* /root/docker/

RUN mkdir -p /root/client
COPY client/* /root/client/

RUN mkdir -p /root/server
COPY server/* /root/server/

COPY .env /root/.env
COPY client.js /root/client.js
COPY package.json /root/package.json

RUN chmod +x /root/docker/startup.sh

CMD cd /root/docker && ./startup.sh

EXPOSE 3000