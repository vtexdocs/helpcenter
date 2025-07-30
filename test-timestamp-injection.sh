#!/bin/bash

echo "🧪 Testing Algolia timestamp injection..."

# Generate test timestamps
TIMESTAMP=$(date +%s)
DATETIME_ISO=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "📅 Test timestamp: $TIMESTAMP"
echo "📅 Test datetime: $DATETIME_ISO"

# Create a temporary test directory
TEST_DIR="./test-algolia-timestamp"
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"

# Clone the scraper for testing
echo "🔄 Cloning docsearch-scraper for testing..."
git clone --quiet https://github.com/vtexdocs/docsearch-scraper.git "$TEST_DIR/docsearch-scraper"

# Test the patching logic
STRATEGY_FILE="$TEST_DIR/docsearch-scraper/scraper/src/strategies/default_strategy.py"

echo "🔧 Applying timestamp patch..."
cp "$STRATEGY_FILE" "${STRATEGY_FILE}.backup"

# Apply the same patch as in our script
python3 -c "
import re

# Read the original file
with open('$STRATEGY_FILE', 'r') as f:
    content = f.read()

# Find the line with objectID assignment and inject timestamps after it
pattern = r\"(\\s+record\\['objectID'\\] = digest_hash)\"
replacement = r\"\\1\\n            # Inject timestamps into every record\\n            record['indexed_at'] = '$DATETIME_ISO'\\n            record['indexed_timestamp'] = $TIMESTAMP\"

# Apply the patch
patched_content = re.sub(pattern, replacement, content)

# Write back to file
with open('$STRATEGY_FILE', 'w') as f:
    f.write(patched_content)

print('✅ Patch applied successfully')
"

# Verify the patch worked
echo "🔍 Verifying patch was applied..."
if grep -q "indexed_at" "$STRATEGY_FILE" && grep -q "indexed_timestamp" "$STRATEGY_FILE"; then
    echo "✅ SUCCESS: Timestamp injection patch applied correctly!"
    echo ""
    echo "📋 Patched code:"
    grep -A 3 -B 1 "Inject timestamps" "$STRATEGY_FILE"
    echo ""
    echo "🔢 Timestamp values that would be injected:"
    echo "   indexed_at: $DATETIME_ISO"
    echo "   indexed_timestamp: $TIMESTAMP"
else
    echo "❌ FAILED: Patch was not applied correctly"
    exit 1
fi

# Verify the Python syntax is still valid
echo ""
echo "🐍 Checking Python syntax validity..."
if python3 -m py_compile "$STRATEGY_FILE" 2>/dev/null; then
    echo "✅ SUCCESS: Patched Python code is syntactically valid"
else
    echo "❌ FAILED: Patched code has syntax errors"
    echo "Original code:"
    head -10 "${STRATEGY_FILE}.backup"
    exit 1
fi

# Show the diff
echo ""
echo "📝 Changes made to the strategy file:"
diff -u "${STRATEGY_FILE}.backup" "$STRATEGY_FILE" || true

# Cleanup
rm -rf "$TEST_DIR"

echo ""
echo "🎉 All tests passed! The timestamp injection is working correctly."
echo "💡 Next step: Run 'yarn index' to test with actual Algolia indexing."
