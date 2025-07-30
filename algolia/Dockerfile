# Use Python 3.9 (similar to GitHub Actions)
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome and dependencies for Selenium
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY algolia/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy Algolia scripts and configs
COPY algolia/ ./algolia/

# Copy environment file template
COPY .env.local.example .env.local.example

# Make scripts executable
RUN chmod +x ./algolia/scripts/*.sh

# Set environment variables for Chrome
ENV CHROME_BIN=/usr/bin/google-chrome
ENV CHROME_PATH=/usr/bin/google-chrome

# Create entrypoint script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "🐳 Docker Algolia Scraper with Timestamp Injection"\n\
echo "📅 Current time: $(date)"\n\
\n\
# Check if required environment variables are set\n\
if [ -z "$ALGOLIA_APP_ID" ] || [ -z "$ALGOLIA_WRITE_KEY" ]; then\n\
    echo "❌ Error: ALGOLIA_APP_ID and ALGOLIA_WRITE_KEY environment variables must be set"\n\
    echo "Usage: docker run -e ALGOLIA_APP_ID=your_id -e ALGOLIA_WRITE_KEY=your_key algolia-scraper"\n\
    exit 1\n\
fi\n\
\n\
# Export for the scraper script\n\
export NEXT_PUBLIC_ALGOLIA_APP_ID=$ALGOLIA_APP_ID\n\
export NEXT_PUBLIC_ALGOLIA_WRITE_KEY=$ALGOLIA_WRITE_KEY\n\
\n\
# Run the scraper based on arguments\n\
if [ "$1" = "test" ]; then\n\
    echo "🧪 Running single page test..."\n\
    exec ./algolia/scripts/test_single_page_docker.sh\n\
elif [ "$1" = "full" ]; then\n\
    echo "🚀 Running full scraper..."\n\
    exec ./algolia/scripts/scraper_docker.sh\n\
else\n\
    echo "Usage: docker run algolia-scraper [test|full]"\n\
    echo "  test - Run single page test"\n\
    echo "  full - Run full scraper"\n\
    exit 1\n\
fi' > /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
