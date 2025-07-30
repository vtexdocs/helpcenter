#!/bin/bash
set -e

cd "$(dirname "$0")/.."

# Load environment variables from .env.local
if [ -f .env.local ]; then
    export $(grep "^NEXT_PUBLIC_ALGOLIA_APP_ID\|^NEXT_PUBLIC_ALGOLIA_WRITE_KEY" .env.local | sed 's/NEXT_PUBLIC_//g')
else
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your Algolia credentials:"
    echo "NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id"
    echo "NEXT_PUBLIC_ALGOLIA_WRITE_KEY=your_write_key"
    exit 1
fi

if [ -z "$ALGOLIA_APP_ID" ] || [ -z "$ALGOLIA_WRITE_KEY" ]; then
    echo "❌ Error: ALGOLIA_APP_ID and ALGOLIA_WRITE_KEY not found in .env.local"
    exit 1
fi

MODE=${1:-test}

echo "🐳 Running Algolia Scraper in Docker"
echo "🔑 App ID: $ALGOLIA_APP_ID"
echo "🔑 API Key: ${ALGOLIA_WRITE_KEY:0:10}..."
echo "📝 Mode: $MODE"
echo ""

docker run --rm \
    -e ALGOLIA_APP_ID="$ALGOLIA_APP_ID" \
    -e ALGOLIA_WRITE_KEY="$ALGOLIA_WRITE_KEY" \
    algolia-scraper "$MODE"
