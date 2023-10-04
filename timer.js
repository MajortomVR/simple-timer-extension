const TimerState = {
   STOPPED: 'Stopped',
   PAUSED: 'Paused',
   RUNNING: 'Running',
   FINISHED: 'Finished'
};

var Timer = class Timer {
   constructor() {
      this.state = TimerState.STOPPED;
      this.lastUpdateTimestamp = 0;
      this.timeLeftSeconds = 0;
      this.notificationSent = false;
   }

   isRunning() {
      return this.state == TimerState.RUNNING;
   }

   isPaused() {
      return this.state == TimerState.PAUSED;
   }

   isFinished() {
      return this.state == TimerState.FINISHED;
   }

   isStopped() {
      return this.state == TimerState.STOPPED;
   }

   isNotificationSent() {
      return this.notificationSent;
   }

   setNotificationSent() {
      this.notificationSent = true;
   }

   start(timeSeconds) {
      this.state = TimerState.RUNNING;
      this.lastUpdateTimestamp = new Date().getTime();
      this.timeLeftSeconds = timeSeconds;
      this.notificationSent = false;
   }

   pause() {
      if (this.state == TimerState.RUNNING) {
         this.state = TimerState.PAUSED;
         this._updateTimeLeft();
      }
   }

   resume() {
      if (this.state == TimerState.PAUSED) {
         this.lastUpdateTimestamp = new Date().getTime();
         this.state = TimerState.RUNNING;
      }
   }

   reset() {
      this.state = TimerState.STOPPED;
      this.lastUpdateTimestamp = 0;
      this.timeLeftSeconds = 0;
      this.notificationSent = false;
   }

   update() {
      if (this.state == TimerState.RUNNING) {
         this._updateTimeLeft();

         if (this.timeLeftSeconds <= 0) {
            this.state = TimerState.FINISHED;
            this.timeLeftSeconds = 0;
         }
      }
   }

   _updateTimeLeft() {
      let timeElapsed = (new Date().getTime() - this.lastUpdateTimestamp) / 1000.0;
      this.timeLeftSeconds = Math.max(this.timeLeftSeconds - timeElapsed, 0);
      this.lastUpdateTimestamp = new Date().getTime();
   }
}