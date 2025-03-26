#!/usr/bin/env bash

# ================================================================================
# GitHub Private Key Extraction Script
# ================================================================================
#
# PURPOSE:
#   This script extracts the GitHub App private key from environment variables and
#   creates a PEM file that can be used for GitHub API authentication. It supports
#   both local development and Netlify deployment environments.
#
# USAGE:
#   ./getPEM.sh
#
# REQUIREMENTS:
#   - GITHUB_PRIVATEKEY environment variable must be set
#     - For Netlify: The key should be base64 encoded
#     - For local: The key should have '\n' for newlines
#
# INTEGRATION WITH GITHUB:
#   This script is a critical part of the GitHub integration, as it:
#   1. Provides the authentication key needed for the Octokit client
#   2. Supports the throttling and rate limiting improvements
#   3. Enables GitHub API access with proper authentication
#   4. Works seamlessly across development and production environments
# ================================================================================

# Source environment variables from .env.local if it exists
[ ! -f .env.local ] || set -a && source .env.local && set +a

# Check if GITHUB_PRIVATEKEY is set
if [ -z "$GITHUB_PRIVATEKEY" ]; then
    echo "ERROR: GITHUB_PRIVATEKEY environment variable is not set."
    echo "Please set GITHUB_PRIVATEKEY in your .env.local file or environment."
    exit 1
fi

# Create PEM file based on environment
if [ "$NETLIFY" = true ]; then
    echo 'Building on Netlify: Extracting base64-encoded PEM file'
    if ! printenv GITHUB_PRIVATEKEY | base64 -d > github.pem; then
        echo "ERROR: Failed to decode GITHUB_PRIVATEKEY from base64."
        exit 1
    fi
    echo 'Successfully created github.pem file for Netlify environment'
else
    echo 'Building locally: Converting newline representations in PEM file'
    if ! printenv GITHUB_PRIVATEKEY | sed 's/\\n/\n/g' > github.pem; then
        echo "ERROR: Failed to process GITHUB_PRIVATEKEY."
        exit 1
    fi
    echo 'Successfully created github.pem file for local environment'
fi

# Verify the PEM file was created
if [ ! -f github.pem ] || [ ! -s github.pem ]; then
    echo "ERROR: github.pem file was not created or is empty."
    exit 1
fi

echo "GitHub PEM file successfully created and verified."
