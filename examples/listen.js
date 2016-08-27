var Lightscene = require("../")
var enocean = require("node-enocean")();
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var delay = require('timeout-as-promise');

var lightscene = new Lightscene(enocean)

enocean.listen("/dev/ttyUSB0");
enocean.on("ready", function(){
  enocean.learn({id:"002a1d4d",eep:"f6-02-03"})
})
