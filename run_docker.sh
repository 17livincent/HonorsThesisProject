#!/bin/bash
# This script creates and starts the Docker container.
docker build -t signorm-image .
docker rm -f signorm-cont
docker run -d -p 80:3000 --restart=always --name signorm-cont signorm-image
docker system prune