#!/bin/sh -l
set -e

echo "🧪 Testing single page indexing with timestamp injection"

# Load environment variables
if [ -e ./.env ]
then
  export $(grep "^NEXT_PUBLIC_ALGOLIA_APP_ID\|^NEXT_PUBLIC_ALGOLIA_WRITE_KEY" .env)
fi

if [ -e ./.env.local ]
then
  export $(grep "^NEXT_PUBLIC_ALGOLIA_APP_ID\|^NEXT_PUBLIC_ALGOLIA_WRITE_KEY" .env.local)
fi

if [ -z "${NEXT_PUBLIC_ALGOLIA_APP_ID}" ] || [ -z "${NEXT_PUBLIC_ALGOLIA_WRITE_KEY}" ]
then
  echo "❌ Required keys are missing in your .env file"
  exit 1
fi

# Remove existing scraper directory
rm -rf ./docsearch-scraper

# Clone the scraper
echo "📥 Cloning docsearch-scraper..."
git clone https://github.com/vtexdocs/docsearch-scraper.git

# Generate timestamps for indexing
TIMESTAMP=$(date +%s)
DATETIME_ISO=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "📅 Indexing at: $DATETIME_ISO (timestamp: $TIMESTAMP)"

# Copy test config  
cp ./algolia/scraper_test_single.json ./docsearch-scraper/configs/

# Set up virtual environment if it doesn't exist
if [ ! -d "./algolia-indexing-env" ]; then
    echo "🔌 Setting up Python virtual environment..."
    ~/.pyenv/versions/3.6.15/bin/python -m venv algolia-indexing-env
    source algolia-indexing-env/bin/activate
    pip install --upgrade pip
    pip install -r ./algolia/requirements_py36.txt
else
    echo "🔌 Activating existing virtual environment..."
    source algolia-indexing-env/bin/activate
fi

# Patch the default strategy to inject timestamps into every record
echo "🔧 Patching scraper to inject timestamps into every record"
STRATEGY_FILE="./docsearch-scraper/scraper/src/strategies/default_strategy.py"

# Use the separate Python script for patching
python ./algolia/scripts/patch_timestamps.py "$STRATEGY_FILE" "$TIMESTAMP" "$DATETIME_ISO"

cd docsearch-scraper/

# Download chromedriver first
echo "📥 Downloading chromedriver..."
chromedriverStableVersion=$(curl -s 'https://chromedriver.storage.googleapis.com/LATEST_RELEASE')
curl -s -L -o chromedriver_mac64.zip "https://chromedriver.storage.googleapis.com/${chromedriverStableVersion}/chromedriver_mac64.zip"
unzip chromedriver_mac64.zip
chmod +x chromedriver

# Create the .env file for docsearch
echo "APPLICATION_ID=${NEXT_PUBLIC_ALGOLIA_APP_ID}
API_KEY=${NEXT_PUBLIC_ALGOLIA_WRITE_KEY}
CHROMEDRIVER_PATH=./chromedriver
" > .env

# Install core dependencies manually
echo "📦 Installing core dependencies..."
pip install "algoliasearch>=2.0,<3.0" "scrapy==2.2.1" "selenium==3.141.0" "python-dotenv==0.7.1" "requests" "requests-iap==0.2.0" "tldextract==2.1.0" "ratelimit==1.4.1"

echo "🚀 Running single page indexing test..."
python ./docsearch run ./configs/scraper_test_single.json

echo "✅ Successfully indexed single page with timestamps to Algolia"

cd ..

# Clean up
rm -rf ./docsearch-scraper

echo "🎉 Test complete! Check your Algolia index 'helpcenter-docs-test' for the results."
