#!/bin/bash

# Check if commit message is provided as an argument
if [ -z "$1" ]; then
  echo "No commit message provided. Exiting..."
  exit 1
fi

# Stage all changes
git add .

# Commit changes with the provided message
git commit -m "$1"

# Push changes to the repository
git push origin main

# Notify user of successful push
echo "Changes pushed successfully!"

