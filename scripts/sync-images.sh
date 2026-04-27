#!/bin/bash

set -euo pipefail

# Configuration
# These should ideally be set in your environment or a .env file
# This script uses the AWS CLI configured with R2 credentials

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: aws-cli is not installed. Please install it first."
    exit 1
fi

# Load environment variables if .env file exists
if [ -f .env ]; then
  echo "📄 Loading variables from .env..."
  set -a
  source .env
  set +a
fi

# Check for required variables
if [ -z "${R2_ACCOUNT_ID:-}" ] || [ -z "${R2_BUCKET_NAME:-}" ] || [ -z "${R2_ACCESS_KEY_ID:-}" ] || [ -z "${R2_SECRET_ACCESS_KEY:-}" ]; then
    echo "Error: R2_ACCOUNT_ID, R2_BUCKET_NAME, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY must be set."
    echo "You can set them in a .env file or export them in your shell."
    exit 1
fi

export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="auto"

echo "🚀 Syncing public/Terengganu/ to Cloudflare R2 bucket: $R2_BUCKET_NAME..."

aws s3 sync public/Terengganu/ "s3://$R2_BUCKET_NAME/Terengganu/" \
  --endpoint-url "https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com" \
  --size-only \
  --delete

echo "✅ Sync complete!"
