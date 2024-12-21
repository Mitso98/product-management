#!/bin/bash

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose could not be found. Please install it first."
    exit 1
fi

# Set variables for the environment file and compose file
ENV_FILE="development.local.env"
COMPOSE_FILE="docker-compose.dev.yml"

# Run the docker-compose command
docker-compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" build --no-cache
docker-compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up 
