#!/bin/bash

# Navigate to studyFE and run npm run dev in background
cd ./studyFE || exit
echo "Starting Frontend..."
npm run dev &    # Run in background
disown           # Detach process
cd ..

# Navigate to studyBE and run npm run dev in background
cd ./studyBE || exit
echo "Starting Backend..."
npm run dev &    # Run in background
disown           # Detach process
cd ..

echo "Both Frontend and Backend servers are running!"
