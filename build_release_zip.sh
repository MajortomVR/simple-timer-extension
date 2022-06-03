#!/bin/bash 

FILENAME_ZIP="extension.zip"

FILES="
   metadata.json \
   *.js \
   stylesheet.css \
   sfx \
   LICENSE \
   "

rm -f $FILENAME_ZIP
zip -r $FILENAME_ZIP $FILES