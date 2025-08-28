#!/bin/bash

# Job Board Backend Deployment Script
# Usage: ./deploy.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    echo "🚀 Deploying to PRODUCTION environment..."
    
    # Check if .env.prod exists
    if [ ! -f .env.prod ]; then
        echo "❌ Error: .env.prod file not found!"
        echo "Please create a .env.prod file with production environment variables."
        exit 1
    fi
    
    # Load production environment variables
    export $(cat .env.prod | grep -v '^#' | xargs)
else
    echo "🚀 Deploying to DEVELOPMENT environment..."
fi

echo "📦 Building and starting services..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

# Remove old images (optional, uncomment if needed)
# echo "🧹 Removing old images..."
# docker-compose -f $COMPOSE_FILE down --rmi all

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f $COMPOSE_FILE up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo "🏥 Checking service health..."
docker-compose -f $COMPOSE_FILE ps

# Show logs
echo "📋 Recent logs:"
docker-compose -f $COMPOSE_FILE logs --tail=20

echo "✅ Deployment completed successfully!"
echo "🌐 Backend API: http://localhost:5000"
echo "📚 API Documentation: http://localhost:5000/api-docs"
echo "💚 Health Check: http://localhost:5000/health"

if [ "$ENVIRONMENT" = "prod" ]; then
    echo "🔒 Production deployment active"
    echo "📊 Monitor logs: docker-compose -f $COMPOSE_FILE logs -f"
else
    echo "🔧 Development deployment active"
    echo "📊 Monitor logs: docker-compose -f $COMPOSE_FILE logs -f"
fi
