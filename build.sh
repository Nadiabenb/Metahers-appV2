#!/bin/bash
set -e

# Build client with Vite (outputs to dist/public)
echo "Building client..."
vite build

# Build server with esbuild (output to dist/server/index.js)
echo "Building server..."
esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outfile=dist/server/index.js

echo "Build complete!"
echo "Client: dist/public"
echo "Server: dist/server/index.js"
