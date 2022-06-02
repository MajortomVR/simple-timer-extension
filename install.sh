#!/bin/bash

# Extract Extension Name
EXTENSION_NAME=$(cat "metadata.json" | grep "uuid" | cut -d'"' -f 4)
TARGET_DIRECTORY="/home/"$USER"/.local/share/gnome-shell/extensions/"$EXTENSION_NAME

#echo $EXTENSION_NAME
#echo ~$USER
#echo $TARGET_DIRECTORY

# Create Main Folder
mkdir -p $TARGET_DIRECTORY

# Copy files & directories
cp -r sfx $TARGET_DIRECTORY
cp README.md $TARGET_DIRECTORY
cp metadata.json $TARGET_DIRECTORY
cp stylesheet.css $TARGET_DIRECTORY
cp extension.js $TARGET_DIRECTORY
cp misc.js $TARGET_DIRECTORY
cp timer.js $TARGET_DIRECTORY

echo "Installed Extension to: "$TARGET_DIRECTORY