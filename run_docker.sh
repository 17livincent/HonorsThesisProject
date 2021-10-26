#!/bin/bash
# This script creates and starts the Docker container.
docker build -t signorm-image .
docker rm -f signorm-cont
docker run -d -p 3000:3000 --restart=always --name signorm-cont signorm-image
docker system prune