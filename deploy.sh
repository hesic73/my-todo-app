#!/bin/bash
echo "Building the React app..."
cd frontend && npm run build
echo "Starting the FastAPI app in production mode..."
cd ../backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
