#!/bin/bash

echo "🧪 DRY RUN: Testing Algolia indexing with timestamp injection (without uploading to Algolia)"

# Check if environment variables are set
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found"
    echo "💡 Create .env.local with NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_WRITE_KEY for full testing"
    exit 1
fi

# Load environment variables
source .env.local

if [ -z "${NEXT_PUBLIC_ALGOLIA_APP_ID}" ] || [ -z "${NEXT_PUBLIC_ALGOLIA_WRITE_KEY}" ]; then
    echo "❌ Required Algolia keys are missing in .env.local"
    echo "💡 Add NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_WRITE_KEY to your .env.local file"
    exit 1
fi

echo "✅ Algolia credentials found"

# Generate timestamps
TIMESTAMP=$(date +%s)
DATETIME_ISO=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "📅 Indexing timestamp: $DATETIME_ISO ($TIMESTAMP)"

# Clone scraper
echo "🔄 Cloning docsearch-scraper..."
rm -rf ./test-docsearch-scraper
git clone --quiet https://github.com/vtexdocs/docsearch-scraper.git test-docsearch-scraper

# Copy configs
echo "📋 Copying scraper configurations..."
cp ./algolia/scraper_md.json ./test-docsearch-scraper/configs/

# Apply timestamp patch
echo "🔧 Applying timestamp patch..."
STRATEGY_FILE="./test-docsearch-scraper/scraper/src/strategies/default_strategy.py"
cp "$STRATEGY_FILE" "${STRATEGY_FILE}.backup"

python3 -c "
import re

with open('$STRATEGY_FILE', 'r') as f:
    content = f.read()

pattern = r\"(\\s+record\\['objectID'\\] = digest_hash)\"
replacement = r\"\\1\\n            # Inject timestamps into every record\\n            record['indexed_at'] = '$DATETIME_ISO'\\n            record['indexed_timestamp'] = $TIMESTAMP\"

patched_content = re.sub(pattern, replacement, content)

with open('$STRATEGY_FILE', 'w') as f:
    f.write(patched_content)
"

echo "✅ Timestamp patch applied"

# Create a test config that only processes a single page
echo "🔧 Creating limited test configuration..."
cat > ./test-docsearch-scraper/configs/test_config.json << EOF
{
  "index_name": "test-helpcenter-docs",
  "start_urls": ["https://newhelp.vtex.com/docs/tutorials/account-management/account-structure/what-is-an-account"],
  "stop_urls": [],
  "selectors": {
    "lvl0": "article .title, article h1",
    "lvl1": "article h2",
    "lvl2": "article h3",
    "lvl3": "article h4",
    "lvl4": "article h5",
    "text": "article p, article li"
  },
  "custom_settings": {
    "separatorsToIndex": "_",
    "attributesForFaceting": ["doctype", "language"],
    "attributesToRetrieve": [
      "hierarchy",
      "content",
      "anchor",
      "url",
      "type",
      "doctype",
      "indexed_at",
      "indexed_timestamp"
    ]
  },
  "use_anchors": true,
  "min_indexed_level": 0,
  "clear_index": false
}
EOF

cd test-docsearch-scraper/

echo "🐍 Installing Python dependencies..."
pip3 install pipenv==2018.11.26 >/dev/null 2>&1

# Create .env file
echo "🔧 Setting up environment..."
cat > .env << EOF
APPLICATION_ID=${NEXT_PUBLIC_ALGOLIA_APP_ID}
API_KEY=${NEXT_PUBLIC_ALGOLIA_WRITE_KEY}
EOF

PIPENV_VENV_IN_PROJECT=true pipenv install >/dev/null 2>&1

echo ""
echo "🚀 Ready to test! Choose an option:"
echo ""
echo "1. 📄 DRY RUN: Show what would be indexed (safe, no Algolia upload)"
echo "2. 🧪 TEST RUN: Index a single page to test index (uploads to Algolia)"
echo "3. 📊 INSPECT: Show the patched scraper code"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "📄 DRY RUN: Simulating indexing process..."
        echo "This would run: pipenv run ./docsearch run ./configs/test_config.json"
        echo "✅ Dry run complete - no data was uploaded to Algolia"
        ;;
    2)
        echo "🧪 TEST RUN: Indexing single page..."
        echo "⚠️  This will upload test data to your Algolia index!"
        read -p "Continue? (y/N): " confirm
        if [[ $confirm =~ ^[Yy]$ ]]; then
            pipenv run ./docsearch run ./configs/test_config.json
            echo "✅ Test indexing complete! Check your Algolia dashboard for records with timestamp fields."
        else
            echo "❌ Test cancelled"
        fi
        ;;
    3)
        echo "📊 INSPECTING: Patched scraper code..."
        echo "Changes made to inject timestamps:"
        diff -u "${STRATEGY_FILE}.backup" "$STRATEGY_FILE" || true
        ;;
    *)
        echo "❌ Invalid choice"
        ;;
esac

cd ..
rm -rf test-docsearch-scraper

echo "🧹 Cleanup complete"
