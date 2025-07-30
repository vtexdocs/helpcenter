#!/bin/bash
set -e

echo "🐳 Building Algolia Scraper Docker Image"

# Build from the algolia directory
cd "$(dirname "$0")"

echo "📦 Building Docker image..."
docker build -t algolia-scraper -f Dockerfile ..

echo "✅ Docker image 'algolia-scraper' built successfully!"
echo ""
echo "Usage:"
echo "  Test single page:"
echo "    ./docker-run.sh test"
echo ""
echo "  Run full scraper:"
echo "    ./docker-run.sh full"
