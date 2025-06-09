#!/usr/bin/env bash

shopt -s nullglob

FILENAME_ZIP="simple-timer@majortomvr.github.com.zip"
FILES=(
   LICENSE
   metadata.json
   schemas/*.gschema.xml
   stylesheet.css
   *.js
   src
   sfx
)

if [[ "$1" == "--manual-install" ]]; then
   #echo "Manual install zip (including compiled schema)"
   FILES+=("schemas/gschemas.compiled")
   FILENAME_ZIP="install-${FILENAME_ZIP}"
fi

rm -f "$FILENAME_ZIP"
zip -r "$FILENAME_ZIP" "${FILES[@]}"