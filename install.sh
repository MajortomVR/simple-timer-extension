#!/bin/bash
echo "START"

# Extract Extension Name
EXTENSION_NAME=$(cat "metadata.json" | grep "uuid" | cut -d'"' -f 4)
TARGET_DIRECTORY="/home/"$USER"/.local/share/gnome-shell/extensions/"$EXTENSION_NAME

#echo $EXTENSION_NAME
#echo ~$USER
#echo $TARGET_DIRECTORY

# Create Main Folder
mkdir -p -v $TARGET_DIRECTORY

# Copy files & directories
cp -r -v sfx $TARGET_DIRECTORY
cp -v README.md $TARGET_DIRECTORY
cp -v metadata.json $TARGET_DIRECTORY
cp -v stylesheet.css $TARGET_DIRECTORY
cp -v extension.js $TARGET_DIRECTORY
cp -v misc.js $TARGET_DIRECTORY
cp -v timer.js $TARGET_DIRECTORY