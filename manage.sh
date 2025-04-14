#!/bin/bash

# Define the Docker Compose command based on the input argument
case "$1" in
    start)
        echo "Starting Docker containers..."
        docker-compose up --build -d
        ;;
    stop)
        echo "Stopping Docker containers..."
        docker-compose down
        ;;
    *)
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac
