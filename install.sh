#!/usr/bin/env bash

# Extract Extension Name
EXTENSION_NAME=$(grep "uuid" "metadata.json" | cut -d'"' -f 4)
TARGET_DIRECTORY="/home/$USER/.local/share/gnome-shell/extensions/$EXTENSION_NAME"

#echo "$EXTENSION_NAME"
#echo ~"$USER"
#echo "$TARGET_DIRECTORY"

# Create Main Folder
mkdir -p "$TARGET_DIRECTORY"

# Copy files & directories
cp -r sfx "$TARGET_DIRECTORY"
cp README.md "$TARGET_DIRECTORY"
cp metadata.json "$TARGET_DIRECTORY"
cp stylesheet.css "$TARGET_DIRECTORY"
cp extension.js "$TARGET_DIRECTORY"
cp misc.js "$TARGET_DIRECTORY"
cp timer.js "$TARGET_DIRECTORY"

echo "Installed the extension to: $TARGET_DIRECTORY"
