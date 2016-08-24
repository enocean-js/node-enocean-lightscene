# node-enocean-lightscene
a lightscene manager for node-enocean
## install
    npm install node-enocean-lightscene
## usage
    var Lightscene = require("node-enocean-lightscene")
    var enocean = require("node-enocean")();
    var async = require('asyncawait/async');
    var await = require('asyncawait/await');
    var lightscene = new Lightscene(enocean)

    enocean.listen("/dev/ttyUSB0");
    enocean.on("ready", async (function(){
      var s=  {
        "name":"Test",
        "desc":"Test",
        "run":[{"type":"switch","ch":1,"value":"off"},{"type":"dimmer","ch":4,"value":100,"speed":"ff"}]
      }
      await(lightscene.execute(s))
      enocean.close()
    })
## saving a lightscene
  you can save a lightscene by calling `lightscene.addOrEdit` with an Object or String

    var s=  {
      "name":"Test",
      "desc":"Test",
      "run":[{"type":"switch","ch":1,"value":"off"},{"type":"dimmer","ch":4,"value":100,"speed":"ff"}]
    }
    lightscene.addOrEdit(s)

or

    var st="Test  : w 1000, s 1 on, w 1000, d 4 50, w 1000, s 1 off, w 1000 ,d 4 40 01"
    lightscene.addOrEdit(s)

if you save a scene it will be persited to disk for later use. to call a saved scene just do

    lightscene.execute("Test")

## supported commands

### switch (s)

instantiates a node-enocean-button and calls its respective methods.

|parameter|value|description|
|-------|----|--|
|type|"switch" or short "s"| the name of the command.|
|ch|1-127| the channel or address of the button to send the command|
|value| "on" or "off"| switches the light on or off|

### dimmer (d)

instantiates a node-enocean-dimmer and calls its respective methods.

|parameter|value|description|
|-------|----|--|
|type|"dimmer" or short "d"| the name of the command.|
|ch|1-127| the channel or address of the button to send the command|
|value|"off" or 0-100| switches the light off or sets the dimm value in percentages|
|speed(optional)|"00" to "ff"| two digit hex-string. sets the dimming speed|

### wait (w)

waits for the given time in milliseconds before executing the next commands

|parameter|value|description|
|-------|----|--|
|type|"wait" or short "w"| the name of the command.|
|value|number in ms| sets the waiting time in milliseconds|
