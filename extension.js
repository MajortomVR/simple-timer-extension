const St = imports.gi.St;
const Main = imports.ui.main;
const MainLoop = imports.mainloop;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Clutter = imports.gi.Clutter;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Misc = Me.imports.misc;
const Timer = Me.imports.timer;


class Extension {
   constructor() {
            
   }

   enable() {
      this.timer = new Timer.Timer();
      this.panelButton = new PanelMenu.Button(0, "MainButton", false);      
      
      // MAIN PANEL
      this.icon = new St.Icon({
         icon_name: 'alarm-symbolic',
         style_class: 'system-status-icon'
      });
      this.timerLabel = new St.Label({
         style_class: 'countdown',
         text: '0:00',
         y_expand: true,
         y_align: Clutter.ActorAlign.CENTER
      });
      this.timerLabel.hide();
      
      this.panelButtonLayout = new St.BoxLayout();
      this.panelButtonLayout.add(this.icon);
      this.panelButtonLayout.add(this.timerLabel);     
      
      // PANEL-MENU      
      this.menuButton = new PopupMenu.PopupImageMenuItem("Stop", "media-playback-stop-symbolic");      
      this.menuButton.connect('activate', () => {
         this.timer.reset();
         this.changeTimerLabelStyle(false);
         this.updateTimerLabel();
         this.timerLabel.hide();
      });
      this.panelButton.menu.addMenuItem(this.menuButton);      
      
      // Timer Input Field            
      this.timerEntry = new St.Entry({
         name: 'time',
         primary_icon : new St.Icon({ icon_name : 'media-playback-start-symbolic', icon_size : 24 }),
         can_focus : true,
         hint_text: _("Enter countdown time..."),
         x_expand : true,
         y_expand : true
      });

      // Input Field Event Management
      this.timerEntry.clutter_text.connect('activate', ()=> {
         this.timerStart(Misc.parseTimeInput(this.timerEntry.text));
      });
      this.timerEntry.connect('primary-icon-clicked', () => { 
         this.timerStart(Misc.parseTimeInput(this.timerEntry.text));         
      });

      this.itemInput = new PopupMenu.PopupBaseMenuItem({
         reactive : false,
         can_focus : false
      });
      this.itemInput.add(this.timerEntry);
      this.panelButton.menu.addMenuItem(this.itemInput);

      this.panelButton.add_child(this.panelButtonLayout);
      Main.panel.addToStatusArea("Simple-Timer", this.panelButton, 0, "right");
      
      this.initMainLoop();
   }

   disable() {
      this.freeMainLoop();
      this.panelButton.destroy();
   }
   
   initMainLoop() {
      // Update Timer
      this.timeout = MainLoop.timeout_add(1000, () => {
         this.timer.update();
         this.updateTimerLabel();
         
         if (this.timer.finished) {
            this.timer.reset();            
            this.createTimerFinishedAlert();
            this.changeTimerLabelStyle(true);            
         }
         return true;
      });
   }

   freeMainLoop() {
      MainLoop.source_remove(this.timeout);
      this.timeout = null;
   }

   // Starts the timer and sets the countdown time.
   timerStart(timeSeconds) {
      if (timeSeconds > 0) {
         this.timer.start(timeSeconds);
         this.updateTimerLabel();
         this.changeTimerLabelStyle(false);
         this.timerLabel.show();
      }
   }

   // Updates the timer-label with the current time left.
   updateTimerLabel() {
      this.timerLabel.set_text( Misc.formatTime(this.timer.timeLeftSeconds) );
   }

   // Shows the Timer in a different style depending on wether an alert was triggered, or not.
   changeTimerLabelStyle(isAlert) {
      if (this.timerLabel) {
         if (isAlert) {
            this.timerLabel.add_style_class_name('countdown-alert');
            this.timerLabel.remove_style_class_name('countdown');
         } else {
            this.timerLabel.add_style_class_name('countdown');
            this.timerLabel.remove_style_class_name('countdown-alert');
         }
      }
   }      

   
   // Alert by sending a notification and a sound effect.
   createTimerFinishedAlert() {
      // Play Audio
      let player = global.display.get_sound_player();
      let soundFile = Gio.File.new_for_path(Me.dir.get_path() + "/sfx/Polite.wav");
      player.play_from_file(soundFile, 'Alert', null);
      
      // Send Notification
      Main.notify('Timer finished!');
   }   
}


// Initializes the Extension
function init() {
   return new Extension();
}