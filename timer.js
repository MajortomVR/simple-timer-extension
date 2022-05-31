var Timer = class Timer {
   constructor() {
      this.running = false;
      this.lastUpdateTimestamp = new Date().getTime();
      this.timeLeftSeconds = 0;
      this.finished = false;  // Finished is true when the timer has run until 0, but not when it got stopped.
   }   

   start(timeSeconds) {
      this.running = true;
      this.lastUpdateTimestamp = new Date().getTime();
      this.timeLeftSeconds = timeSeconds;      
      this.finished = false;
   }

   reset() {
      this.running = false;
      this.timeLeftSeconds = 0;
      this.finished = false;
   }
   
   update() {
      if (this.running && this.timeLeftSeconds <= 0) {
         this.running = false;
         this.timeLeftSeconds = 0;
         this.finished = true;
      }

      let timeElapsed = new Date().getTime() - this.lastUpdateTimestamp;
      this.lastUpdateTimestamp = new Date().getTime();

      this.timeLeftSeconds -= timeElapsed / 1000;
      this.timeLeftSeconds = Math.max(this.timeLeftSeconds, 0)
   }
}