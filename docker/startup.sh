#!/bin/bash

echo "Starting mysql service..."
chown -R mysql:mysql /var/lib/mysql
service mysql start

echo "Running DB Script..."
# init mysql schema + data
mysql -uroot < /root/docker/dbinit.sql

echo "Installing app dependencies..."
# install app dependencies 
cd /root/client && npm install
cd /root && npm install

echo "Starting app server and client..."
# start app server and client
npm run start