Plus 1.0 (2024-01-01)
---------------------
* Added "Inves Spectrum 128k" spanish clone to emulable machines -> PROCCESS
* Enhanced & Responsive UI -> PROCCESS
* Load in memory only current machine roms -> TODO, me simpificaría bastante el añadir otras maquinas posteriormente.
* Add credit modal-> TODO
* UI translation based on lang files. Lang detection from navigator. If no translation present, fallbacks to EN -> TODO
* Added Mute/Unmute button to footer toolbar
* Guardar/Cargar partidas. Ya sea mediante archivo o haciendo uso de localstorage. -> TODO
* On screen keyboard ?
* ScriptProcessorNode is deprecated. Use AudioWorkletNode instead. -> TODO
* Joysticks support?
* Gestión de maquinas -> Array que almacene toda la info necesaria de cada maquina, para agilizar el alta de nuevas maquinas.
* Gestión de ROMS -> Cargar en memoria solo las de la maquina seleccionada. Esto libera muchas paginas reservadas a ROMS no usadas.
* Gestión de RAM -> Aumentar la memoria hasta 512k para dar soporte a nuevas maquinas. Esto conlleva que las paginas 0-15 seran para RAM y 16-20 para carga de ROMS


3.1 (2021-08-26)
----------------

* Real-time tape loading, including turbo loaders (except for direct recording, CSW and generalized data TZX blocks)
* Emulate floating bus behaviour
* Fix typo in docs (`openURL` -> `openUrl`)


3.0.1 (2021-08-16)
------------------

* Fix relative jump instructions to not treat +0x7f as -0x81 (which broke the Protracker 3 player)


3.0 (2021-08-14)
----------------

Initial release of JSSpeccy 3.

* Web Worker and WebAssembly emulation core
* 48K, 128K, Pentagon emulaton
* Accurate multicolour
* AY and beeper audio
* TAP, TZX, Z80, SNA, SZX, ZIP loading
* Fullscreen mode
* Browsing games from Internet Archive
