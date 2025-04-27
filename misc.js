import Gio from 'gi://Gio';


export const TimeInputFormat = {
   COLONS: 'COLONS',
   LETTERS: 'LETTERS'
};

/**
 * Determinates the format of a given time input.
 * @param {string} text 
 * @returns {string} - TimeInputFormat
 */
export function getTimeInputFormat(text) {
   // Detects the time input format.
   let lowerCasedText = text.toLowerCase();
   
   // If the input contains the letters h, m or s, it's the letter format.   
   if (lowerCasedText.includes("h") || lowerCasedText.includes("m") || lowerCasedText.includes("s")) {      
      return TimeInputFormat.LETTERS;
   // In every other case, fallback to the colon format.
   } else {
      return TimeInputFormat.COLONS;
   }
};


/**
 * Formats the Time to be nicely formatted for printing to the user.
 * @param {*} seconds 
 * @returns the formatted time as a string
 */
export function formatTime(seconds) {
   let text = "";

   let secondsLeft = seconds;

   let hours = Math.floor(secondsLeft / 3600);
   secondsLeft -= hours * 3600;

   let minutes = Math.floor(secondsLeft / 60);
   secondsLeft -= minutes * 60;
   secondsLeft = Math.floor(secondsLeft);

   if (hours > 0) {
      text += hours.toString();
      text += ":";
   }

   if (minutes < 10 && hours > 0) {
      text += "0";
   }

   text += minutes.toString();

   text += ":";
   if (secondsLeft < 10) {
      text += "0";
   }

   text += secondsLeft.toString();

   return text;
}


/**
 *    Takes a Time String (HH:MM:SS) like 2:47 (2min 47) and returns the time in seconds.
 * @param {string} text a string like 2:47 or 1:12:10 (1h, 12min, 10sec)
 * @return {number} the time duration in seconds
 */
export function parseTimeInput(text) {
   if (getTimeInputFormat(text) === TimeInputFormat.LETTERS) {
      return parseTimeInputHMS(text);
   } else {
      return parseTimeInputColons(text);
   }
}

/**
 *    Takes a Time String (HH:MM:SS) like 2:47 (2min 47) and returns the time in seconds.
 * @param {*} text a string like 2:47 or 1:12:10 (1h, 12min, 10sec)
 */
export function parseTimeInputColons(text) {
   const timeArray = text.split(":");
   let timerSeconds = 0;

   for (let i=0; i<timeArray.length; i++) {
      let time = timeArray[timeArray.length - 1 - i];                        
      let timeValue = parseInt(time);

      // Seconds
      if (i == 0) {
         timerSeconds += timeValue;
      // Minutes
      } else if (i == 1) {
         timerSeconds += timeValue * 60;
      // Hours
      } else if (i == 2) {
         timerSeconds += timeValue * 60 * 60;
      }
   }

   return timerSeconds;
}

/**
 * Parses a string input representing a time duration in the format of "Xh Ym Zs" where X is the number of hours, Y is the number of minutes, and Z is the number of seconds.
 * @param {string} text - The input string to parse.
 * @returns {number} The duration in seconds represented by the input string.
 */
export function parseTimeInputHMS(text) {   
   text = timeInputLetterHandler(text) + ' '; // The extra space character is needed for the parsing algorithm

   let buffer = "";
   let timeAmount = 0;
   let timerDurationSeconds = 0;
   
   for (let i=0; i<text.length; i++) {
      let c = text[i];
      let previousChar = (i > 0) ? text[i - 1] : '';

      let currentCharType = getCharacterType(c);
      let previousCharType = getCharacterType(previousChar);

      // If character types are changing
      if (currentCharType != previousCharType) {
         if (buffer.length > 0) {
            if (previousCharType == CharacterType.DIGITS) {
               timeAmount = parseInt(buffer);
            } else if (previousCharType == CharacterType.LETTERS) {
               // Add the time in seconds to the timer
               if (buffer == 'h') {
                  timerDurationSeconds += timeAmount * 60 * 60;
               } else if (buffer == 'm') {
                  timerDurationSeconds += timeAmount * 60;                  
               } else {
                  timerDurationSeconds += timeAmount;
               }      
               
               timeAmount = 0; // Reset because if there is no letter at the end the time-amount will be added and assumed to be seconds.
            }            
         }

         buffer = "";
      }

      if (c != ' ') {
         buffer += c;
      }      
   }

   // If there was no unit [h,m,s] added then assume seconds and add the time to the timer.
   timerDurationSeconds = timerDurationSeconds + timeAmount;

   return timerDurationSeconds;
}


// Returns true if any of the characters 'h', 'm' or 's' are found.
export function isHMSCharacter(character) {
   character = character.toLowerCase();
   return character.includes('h') || character.includes('m') || character.includes('s');
}

/**
 * Returns true if the given char is a digit.
 * @param {string} character 
 * @returns {boolean} if the given character is a digit
 */
export function isDigitCharacter(character) {
   return character >= '0' && character <= '9';
}

/**
 * Returns true if the given char is a letter
 * @param {string} character 
 * @returns {boolean} if the given character is a letter
 */
export function isLetterCharacter(character) {
   return (character >= 'a' && character <= 'z') || (character >= 'A' && character <= 'Z');
}

/**
 * Returns true if the given char is a space ' '
 * @param {string} character 
 * @returns {boolean} if the given character is a space
 */
export function isSpaceCharacter(character) {
   return character === ' ';
}

export const CharacterType = {
   DIGITS: 'DIGITS',
   LETTERS: 'LETTERS',
   SPACE: 'SPACE',
   OTHER: 'OTHER'
};

/**
 * Determines the type of the given character based on predefined character types.
 * @param {string} character - The character to check.
 * @returns {string} The string representation of the character type. Possible values: 'DIGITS', 'LETTERS', 'SPACE', or 'OTHER'.
 */
export function getCharacterType(character) {
   if (character == ' ') {
      return CharacterType.SPACE;
   } else if (isDigitCharacter(character)) {
      return CharacterType.DIGITS;
   } else if (isLetterCharacter(character)) {
      return CharacterType.LETTERS;
   } else {
      return CharacterType.OTHER;
   }
}


/**
 *   Corrects the string to only show numbers, time characters and spaces. Example: 1h 12m 20s
 * @param {string} text 
 * @returns {string} text corrected to the 0h 0m 0s format
 */
export function timeInputLetterHandler(text){
   const allowedChars = "hms1234567890 ";   
   let lowerCasedText = text.toLowerCase();
   let filteredText = "";
   
   // Filter all characters except for 'h','m','s', ' ' (spaces), and digits
   for (let i=0; i<lowerCasedText.length; i++) {
      let c = lowerCasedText[i];

      if (allowedChars.includes(c)) {         
         let previousChar = i > 0 ? lowerCasedText[i - 1] : '';

         // Space is only allowed after a time letter ('h','m','s')
         if (c === ' ' && !isHMSCharacter(previousChar)) {
            continue;
         }

         // Allow only one h, m, s letter
         if (isHMSCharacter(c)) {
            // If the text already has this letter, or the previous character is not a digit, then skip adding the character.
            if (filteredText.includes(c) || !isDigitCharacter(previousChar)) {
               continue;
            }
         }

         filteredText += c;
      }      
   }

   return filteredText;
}

/**
 * Corrects the string to only show numbers and colons in the HH:MM:SS format.
 * @param {string} text 
 * @returns {string} text corrected to the HH:MM:SS format
 */
export function timeInputColonHandler(text) {
   // filter all characters except 0-9
   let numberString = "";

   for (let i=0; i<text.length; i++) {
      let c = text[i];
      if (c >= '0' && c <= '9') {
         numberString += c;
      }
   }

   let numIndex = 0;
   let finalText = "";
   // After every second number, add a colon
   for (let i=numberString.length - 1; i>=0; i--) {
      numIndex++;
                  
      if (numIndex == 3) {
         numIndex = 1;
         finalText = ":" + finalText;
      }

      finalText = numberString[i] + finalText;
   }

   // Only return the first 9 characters
   return finalText.slice(0, 9);
}

/**
 * Checks if a file exists at the specified path.
 * @param {string} file 
 * @returns {boolean}
 */
export function fileExists(file) {
   const gFile = Gio.File.new_for_path(file);
   return gFile.query_exists(null);
}

/**
 * Plays an audio file using the system sound player.
 * @param {string} file - The absolute file path to the audio file to play.
 */
export function playAudio(global, file) {
   const audioFileHandle = Gio.File.new_for_path(file);
   
   const player = global.display.get_sound_player();
   player.play_from_file(audioFileHandle, 'Alert', null);
}