#!/usr/bin/env bash

# Extract Extension Name
EXTENSION_NAME=$(jq -r .uuid metadata.json)
TARGET_DIRECTORY="${HOME}/.local/share/gnome-shell/extensions/${EXTENSION_NAME}"

# Compile schema file
glib-compile-schemas --strict schemas/

bash build_release_zip.sh --manual-install
ZIP_FILENAME="install-${EXTENSION_NAME}.zip"

# Remove old installation
rm -rf "$TARGET_DIRECTORY"
# Unzip into target directory
unzip "$ZIP_FILENAME" -d "$TARGET_DIRECTORY"

echo "Installed the extension to: ${TARGET_DIRECTORY}"
