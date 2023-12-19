# js8bits v1.0

A 8bits computers emulator for the browser

## Features

* Emulates the Spectrum 48K, Spectrum 128K and Pentagon machines
* Handles all Z80 instructions, documented and undocumented
* Cycle-accurate emulation of scanline / multicolour effects
* AY and beeper audio
* Loads SZX, Z80 and SNA snapshots
* Loads TZX and TAP tape images (via traps only)
* Loads any of the above files from inside a ZIP file
* 100% / 200% / 300% and fullscreen display modes

## Implementation notes

js8bits is a ...............

## Embedding

js8bits is designed with embedding in mind. To include it in your own site, download [a release archive](https://github.com/gasman/js8bits3/releases) and copy the contents of the `js8bits` folder somewhere web-accessible. Be sure to keep the .js and .wasm files and the subdirectories in the same place relative to js8bits.js.

In the `<head>` of your HTML page, include the tag

```html
    <script src="/path/to/js8bits.js"></script>
    <link rel="stylesheet" href="/path/to/js8bits.css">
```

replacing `/path/to/` with the path to js8bits.js and css.

At the point in the page where you want the emulator to show, place the code:

```html
    <div id="js8bits"></div>
    <script>js8bits(document.getElementById('js8bits'))</script>
```

If you're suitably confident with JavaScript, you can put the call to `js8bits` anywhere else that runs on page load, or in response to any user action.

You can also pass configuration options as a second argument to `js8bits`:

```html
    <script>js8bits(document.getElementById('js8bits'), {zoom: 2, machine: 48})</script>
```

The available configuration options are:

* `autoStart`: if true, the emulator will start immediately with no need to press the play button. Bear in mind that browser policies usually don't allow enabling audio without a user interaction, so if you enable this option (and don't put the `js8bits` call behind an onclick event or similar), expect things to be silent.
* `autoLoadTapes`: if true, any tape files opened (either manually or through the openUrl option) will be loaded automatically without the user having to enter LOAD "" or select the Tape Loader menu option.
* `tapeAutoLoadMode`: specifies the mode that the machine should be set to before auto-loading tape files. When set to 'default' (the default), this is equivalent to selecting the Tape Loader menu option on machines that support it; when set to 'usr0', this is equivalent to entering 'usr0' in 128 BASIC then LOAD "" from the resulting 48K BASIC prompt (which leaves 128K memory paging available without the extra housekeeping of the 128K ROM - this mode is commonly used for launching demos).
* `machine`: specifies the machine to emulate. Can be `48` (for a 48K Spectrum), `128` (for a 128K Spectrum), or `5` (for a Pentagon 128).
* `openUrl`: specifies a URL, or an array of URLs, to a file (or files) to load on startup, in any supported snapshot, tape or archive format. Standard browser security restrictions apply for loading remote files: if the URL being loaded is not on the same domain as the calling page, it must serve [CORS HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) to be loadable.
* `zoom`: specifies the size of the emulator window; 1 for 100% size (one Spectrum pixel per screen pixel), 2 for 200% size and so on.
* `sandbox`: if true, all UI options for opening a new file are disabled - useful if you're showcasing a specific bit of Spectrum software on your page.
* `tapeTrapsEnabled`: if true (the default), the emulator will recognise when the tape loading routine in the ROM is called, and load tape files instantly instead.
* `keyboardEnabled`: True by default; if false, the emulator will not respond to keypresses.
* `uiEnabled`: True by default; if false, the menu bar and toolbar will not be shown.

For additional JavaScript hackery, the return value of the js8bits function call is an object exposing a number of functions for controlling the running emulator:

```html
    <script>
        let emu = js8bits(document.getElementById('js8bits'));
        emu.openFileDialog();
    </script>
```

* `emu.setZoom(zoomLevel)` - set the zoom level of the emulator
* `emu.enterFullscreen()` - activate full-screen mode
* `emu.exitFullscreen()` - exit full-screen mode
* `emu.toggleFullscreen()` - enter or exit full-screen mode
* `emu.setMachine(machine)` - set the emulated machine type
* `emu.openFileDialog()` - open the file chooser dialog
* `emu.openUrl(url)` - open the file at the given URL
* `emu.loadSnapshotFromStruct(snapshot)` - load a snapshot from the given data structure; the data format is currently undocumented but runtime/snapshot.js should give you a decent idea of it...
* `emu.onReady(callback)` - call the given callback once the emulator is fully initialised
* `emu.exit()` - immediately stop the emulator and remove it from the document


## Licence

js8bits is licensed under the GPL version 3 - see COPYING.
