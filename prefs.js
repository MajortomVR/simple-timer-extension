import Gtk from "gi://Gtk";
import Adw from 'gi://Adw';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import * as Settings from './settings.js';
import * as Misc from './misc.js';

export default class SimpleTimerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        this.settings = new Settings.Settings(this.getSettings());

        // Main Page
        const mainPage = new Adw.PreferencesPage({
            title: 'General',
            icon_name: 'dialog-information-symbolic',
        });
        window.add(mainPage);

        // Add Main Group
        const mainGroup = new Adw.PreferencesGroup({ title: 'Alert' });
        mainPage.add(mainGroup);
        
        // Custom alert sound file chooser
        mainGroup.add( createFileChooser(window, 'Select custom sound file', (file) => this.settings.setCustomAlertSfxFile(file), () => this.settings.getCustomAlertSfxFile()) );
    }
}


// Create a new preferences row
function createFileChooser(parent, title, setFunction, getFunction) {
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
        setFunction('');
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
                    setFunction(selectedFile);
                    onUpdate();
                }
            }
        });

        filechooser.show();
    });

    function onUpdate() {
        const file = getFunction();
        soundFileButton.subtitle = file || 'No file selected';
        
        warningIcon.set_visible(file && !Misc.fileExists(file));
        deleteButton.set_visible(file);
    }
    onUpdate();
    
    return soundFileButton;
}