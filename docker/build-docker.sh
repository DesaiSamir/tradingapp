#!/bin/bash

docker build -t 192.168.1.32:5555/tradingapp .

docker push 192.168.1.32:5555/tradingapp

echo "Ignore cache with --no-cache"