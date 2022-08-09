var Timer = class Timer {
   constructor() {
      this.running = false;
      this.finished = false;  // Finished is true when the timer has run until 0, but not when it got stopped.
      this.startTimestamp = 0;
      this.duration = 0;
      this.timeLeftSeconds = 0;
   }   

   start(timeSeconds) {
      this.running = true;
      this.finished = false;
      this.startTimestamp = new Date().getTime();
      this.duration = timeSeconds;
      this.timeLeftSeconds = timeSeconds;
   }

   reset() {
      this.running = false;
      this.finished = false;
      this.startTimestamp = 0;
      this.timeLeftSeconds = 0;
      this.duration = 0;      
   }
   
   update() {
      if (this.running && this.timeLeftSeconds <= 0) {
         this.running = false;
         this.startTimestamp = 0;
         this.timeLeftSeconds = 0;
         this.finished = true;
      }
      
      let timeElapsed = (new Date().getTime() - this.startTimestamp) / 1000;
      this.timeLeftSeconds = Math.max(this.duration - timeElapsed, 0);
   }
}