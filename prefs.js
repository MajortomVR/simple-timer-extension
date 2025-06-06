import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import * as Settings from './src/Settings.js';
import * as Misc from './src/misc.js';

export default class SimpleTimerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        this.settings = new Settings.Settings(this.getSettings());

        // Main Page
        const mainPage = new Adw.PreferencesPage({
            title: 'General',
            icon_name: 'dialog-information-symbolic',
        });
        window.add(mainPage);

        // Custom alert sound file chooser
        const alertGroup = new Adw.PreferencesGroup({ title: 'Alert' });
        alertGroup.add( createFileChooser(window, 'Select custom sound file', (file) => this.settings.setCustomAlertSfxFile(file), () => this.settings.getCustomAlertSfxFile()) );
        
        // Custom Keyboard Shortcut
        const customKeyboardGroup = new Adw.PreferencesGroup({ title: 'Hotkey' });
        customKeyboardGroup.add( createHotkeyInput(window, 'Hotkey', 'Hotkey to start the timer.', this.settings, this.settings.getAlertStartHotkeyID()) );

        mainPage.add(alertGroup);
        mainPage.add(customKeyboardGroup);
    }
}

/**
 *  Create a new Hotkey-Customizer ActionRow
 * @param {object} parent window
 * @param {string} title Action row title text
 * @param {string} description  Action row subtitle description text
 * @param {Settings} settings Settings object
 * @param {string} hotkeyID The schema name of the hotkey
 * @returns {Adw.ActionRow}
 */
function createHotkeyInput(parent, title, description, settings, hotkeyID) {
    const hotkeyRow = new Adw.ActionRow({
        title: title,
        subtitle: description
    });

    // Displays the shortcut
    const shortcutLabel = new Gtk.ShortcutLabel({
        accelerator: settings.getHotkey(hotkeyID),
        disabled_text: 'Set a hotkey',
        valign: Gtk.Align.CENTER,
        halign: Gtk.Align.CENTER,
    });
    hotkeyRow.add_suffix(shortcutLabel);
    hotkeyRow.activatable_widget = shortcutLabel;

    settings.getSettings().connect(`changed::${hotkeyID}`, () => {
        shortcutLabel.set_accelerator(settings.getHotkey(hotkeyID));
    });

    let isCapturing = false;
    const controller = new Gtk.EventControllerKey();
    // Waiting on key pressed
    controller.connect('key-pressed', (_, keyval, keycode, state) => {
        if (!isCapturing) return Gdk.EVENT_PROPAGATE;
        const mod = state & Gtk.accelerator_get_default_mod_mask();
        
        // Escape cancels capturing mode
        if (!mod && keyval === Gdk.KEY_Escape) {
            isCapturing = false;
            shortcutLabel.set_accelerator(settings.getHotkey(hotkeyID));
            shortcutLabel.disabled_text = 'Set a hotkey';
            return Gdk.EVENT_STOP;
        }

        if (!mod || !Gtk.accelerator_valid(keyval, mod)) return Gdk.EVENT_STOP;
        
        // Save the new shortcut
        const shortcut = Gtk.accelerator_name_with_keycode(
            null,
            keyval,
            keycode,
            mod
        );
        settings.setHotkey(hotkeyID, shortcut);
        isCapturing = false;
        return Gdk.EVENT_STOP;
    });        

    // Activated (clicked) hotkey configuration
    hotkeyRow.connect('activated', () => {            
        isCapturing = true;
        shortcutLabel.set_accelerator('');
        shortcutLabel.disabled_text = 'Set a hotkey ...';
    });
    hotkeyRow.add_controller(controller);
    return hotkeyRow;
}


/**
 * Create a new File-Chooser ActionRow
 * @param {object} parent window
 * @param {string} title string
 * @param {function} onSetAudioFile callback function executed to set(write) the audio filepath
 * @param {function} onGetAudioFile callback function executed to get(read) the audio filepath.
 * @returns {Adw.ActionRow}
 */
function createFileChooser(parent, title, onSetAudioFile, onGetAudioFile) {
    const soundFileButton = new Adw.ActionRow({ title: title });

    // Warning Icon
    const warningIcon = new Gtk.Image({ icon_name: 'dialog-warning-symbolic' });
    warningIcon.set_tooltip_text('File not found');

    // Select File Button
    const fileIcon = new Gtk.Image({ icon_name: 'folder-open-symbolic' });
    const fileButton = new Gtk.Button({ valign: Gtk.Align.CENTER });
    fileButton.set_child(fileIcon);
    fileButton.set_tooltip_text('Select file');

    // Delete Button
    const deleteIcon = new Gtk.Image({ icon_name: 'user-trash-symbolic' });
    const deleteButton = new Gtk.Button({ valign: Gtk.Align.CENTER });
    deleteButton.set_child(deleteIcon);
    deleteButton.set_tooltip_text('Remove custom sound file');

    // Add Icons and Buttons
    soundFileButton.add_prefix(warningIcon);
    soundFileButton.add_suffix(fileButton);
    soundFileButton.add_suffix(deleteButton);

    // Reset the custom sfx file
    deleteButton.connect('clicked', () => {
        onSetAudioFile('');
        onUpdate();
    });

    // Open the file chooser
    fileButton.connect('clicked', () => {
        // Create a row for selecting a custom sound effect file
        const filechooser = new Gtk.FileChooserNative({
            title: title,
            modal: true,
            action: Gtk.FileChooserAction.OPEN,                
        });
        filechooser.set_transient_for(parent);

        // Filter by mime types
        const mimeTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'];
        const filter = new Gtk.FileFilter();
        for (const mimeType of mimeTypes) {
            filter.add_mime_type(mimeType);
        }
        filechooser.set_filter(filter);

        // Handle filechooser response
        filechooser.connect('response', (native, responseID) => {
            if (responseID === Gtk.ResponseType.ACCEPT) {
                const selectedFile = native.get_file().get_path();
                
                if (Misc.fileExists(selectedFile)) {
                    onSetAudioFile(selectedFile);
                    onUpdate();
                }
            }
        });

        filechooser.show();
    });

    function onUpdate() {
        const file = onGetAudioFile();
        soundFileButton.subtitle = file || 'No file selected';
        
        warningIcon.set_visible(file && !Misc.fileExists(file));
        deleteButton.set_visible(file);
    }
    onUpdate();
    
    return soundFileButton;
}