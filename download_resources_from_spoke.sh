#!/bin/bash

# Check parameters
if [ $# -eq 0 ]; then
    echo "Usage: $0 <spoke_file>"
    echo "Example: $0 exhibition-english.spoke"
    exit 1
fi

SPOKE_FILE="$1"

# Check if input file exists
if [ ! -f "$SPOKE_FILE" ]; then
    echo "Error: Cannot find $SPOKE_FILE"
    exit 1
fi

# Create resourcess directory if it doesn't exist
if [ ! -d "resourcess" ]; then
    mkdir -p resourcess
fi

# Extract URLs and resources resources
cat "$SPOKE_FILE" | \
  grep -o '"src":"[^"]*"' | \
  sed 's/"src":"//' | \
  sed 's/"$//' | \
  while read url; do
    if [[ $url == http* ]]; then
      echo "Downloading: $url"
      wget -P resourcess "$url" || echo "Warning: Failed to download $url"
    fi
done

echo "resources completed!"