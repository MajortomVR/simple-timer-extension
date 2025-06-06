export class Settings {
   constructor(gnomeSettings) {
      this._settings = gnomeSettings
   }

   getLastTimerInput() {
      return this._settings.get_string('last-timer-input') || '';
   }
   setLastTimerInput(userTimerInputString) {
      this._settings.set_string('last-timer-input', userTimerInputString);
   }

   getCustomAlertSfxFile() {
      return this._settings.get_string('alert-sfx-file');
   }
   setCustomAlertSfxFile(file) {
      this._settings.set_string('alert-sfx-file', file);
   }

   getAlertStartHotkeyID() {
      return 'keyboard-shortcut';
   }

   getHotkey(hotkeyID) {
      return this._settings.get_strv(hotkeyID)[0];
   }
   setHotkey(hotkeyID, str) {
      this._settings.set_strv(hotkeyID, [str]);
   }

   
   getSettings() {
      return this._settings;
   }
}