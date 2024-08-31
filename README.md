# Simple Timer - Gnome Extension

![Extension Preview](preview.png)

# Description:
**Simple Timer** is a Gnome Shell Extension that adds a timer to your panel.
It sends a notification and plays a sound effect when the timer expires.

Never again will you forget the oven!

# Usage:

There are two ways to enter the duration:

## Direct Numeric Input

You can simply type the time in. The format `hh:mm:ss` will be automatically added.

**Examples:**
- `5` -> `0:05`
- `112` -> `1:12`
- `53000` -> `5:30:00` 

![Extension Preview](preview_5h30m.gif)

## Detailed Time Specification

You can specify the duration using hours, minutes, and seconds (h, m, s). The order of these units is flexible and does not need to follow a specific sequence.

**Examples:**
- `5s` -> `0:05`
- `1m 12s` -> `1:12`
- `5h 30m` -> `5:30:00`
- `30m 5h` -> `5:30:00`
- `1m` -> `1:00`

![Extension Preview](preview_5h30m.gif)

# Installation
   
## Installation - Web
- Visit the [official GNOME Extensions page for Simple Timer](https://extensions.gnome.org/extension/5115/simple-timer/)
- Click on the "ON/OFF" switch to install the extension. If prompted, follow the instructions to enable the GNOME Shell integration.


## Installation - Manual
- After downloading the extension just run the install script:

   ```
   sh install.sh
   ```

## Enable the Extension:

- To enable the extension install gnome-extensions-app and run gnome-extensions-app

   ```
   sudo dnf install gnome-extensions-app
   gnome-extensions-app
   ```

- Or open the gnome extension webpage and enable the extension from there:

   https://extensions.gnome.org/local


# Sources:
- Polite.wav 
   Source: https://github.com/akx/Notifications