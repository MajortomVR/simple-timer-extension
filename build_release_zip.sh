#!/bin/bash 

FILENAME_ZIP="extension.zip"

FILES="
   metadata.json \
   *.js \
   stylesheet.css \
   sfx \
   LICENSE \
   "

zip -r $FILENAME_ZIP $FILES