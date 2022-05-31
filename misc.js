/**
 * Formats the Time to be nicely formatted for printing to the user.
 * @param {*} seconds 
 * @returns the formatted time as a string
 */
function formatTime(seconds) {
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
 *    Takes a Time String like 2:47 (2min 47) and returns the time in seconds.
 * @param {*} text a string like 2:47 or 1:12:10 (1h, 12min, 10sec)
 */
function parseTimeInput(text) {
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