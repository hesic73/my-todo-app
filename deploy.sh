#!/bin/bash

# Build and start the Next.js frontend
echo "Building the Next.js frontend..."
cd frontend && npm run build

echo "Starting the Next.js frontend..."
npm run start &  # Start the frontend in the background

# Start the FastAPI backend
echo "Starting the FastAPI app in production mode..."
cd ../backend && gunicorn --bind 0.0.0.0:8000 -w 4 -k uvicorn.workers.UvicornWorker app.main:app
