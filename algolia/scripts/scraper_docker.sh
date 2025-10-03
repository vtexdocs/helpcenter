#!/bin/bash
set -e

echo "🐳 Docker Full Scraper with Timestamp Injection"

# Clone the scraper
echo "📥 Cloning docsearch-scraper..."
git clone https://github.com/vtexdocs/docsearch-scraper.git

# Generate timestamps for indexing
TIMESTAMP=$(date +%s)
DATETIME_ISO=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "📅 Indexing at: $DATETIME_ISO (timestamp: $TIMESTAMP)"

# Copy original configs  
cp ./algolia/scraper_md.json ./docsearch-scraper/configs/
cp ./algolia/scraper_openapi.json ./docsearch-scraper/configs/ 2>/dev/null || true

# Patch the default strategy to inject timestamps into every record
echo "🔧 Patching scraper to inject timestamps into every record"
STRATEGY_FILE="./docsearch-scraper/scraper/src/strategies/default_strategy.py"

# Use the separate Python script for patching
python ./algolia/scripts/patch_timestamps.py "$STRATEGY_FILE" "$TIMESTAMP" "$DATETIME_ISO"

cd docsearch-scraper/

# Create the .env file for docsearch
echo "APPLICATION_ID=${NEXT_PUBLIC_ALGOLIA_APP_ID}
API_KEY=${NEXT_PUBLIC_ALGOLIA_WRITE_KEY}
CHROMEDRIVER_PATH=/usr/bin/chromedriver
" > .env

# Install pipenv and dependencies
echo "📦 Installing dependencies with pipenv..."
pip install pipenv
export PIPENV_VENV_IN_PROJECT=true
pipenv install

echo "🚀 Running markdown scraper..."
pipenv run python ./docsearch run ./configs/scraper_md.json

echo "🚀 Running OpenAPI scraper..."
pipenv run python ./docsearch run ./configs/scraper_openapi.json

echo "✅ Successfully indexed and uploaded the results to Algolia"

cd ..

# Clean up
rm -rf ./docsearch-scraper

echo "🎉 Docker scraping complete!"
