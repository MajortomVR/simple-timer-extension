import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

export class Hotkey {
   constructor(settings, hotkeyID, onTriggerCallbackFunction) {
      this.settings = settings;
      this.hotkeyID = hotkeyID;
      this.onTriggerCallbackFunction = onTriggerCallbackFunction;
      this.bind();
      
      this.hotkeyChangedWatcherID = settings.getSettings().connect(`changed::${hotkeyID}`, () => {
         this.unbind();
         this.bind();
      });
   }

   free() {
      this.unbind();
      if (this.hotkeyChangedWatcherID) {
         this.settings.getSettings().disconnect(this.hotkeyChangedWatcherID);
         this.hotkeyChangedWatcherID = null;
      }
   }
   
   bind() {
      Main.wm.addKeybinding(
         this.hotkeyID,
         this.settings.getSettings(),
         Meta.KeyBindingFlags.NONE,
         Shell.ActionMode.NORMAL,
         this.onTriggerCallbackFunction
      )
   }

   unbind() {
      Main.wm.removeKeybinding(this.hotkeyID);
   }
}