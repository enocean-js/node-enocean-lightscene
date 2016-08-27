var Lightscene = require("../")
var enocean = require("node-enocean")();
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var delay = require('timeout-as-promise');

var lightscene = new Lightscene(enocean)

enocean.listen("/dev/ttyUSB0");
enocean.on("ready", async (function(){
  var st="Test  : w 1000, s 1 on   ,w 1000 , d 4 50 , w 1000 ,  s 1 off,w 1000 , d 4 40 01    "
  var s=  {
    "name":"Test",
    "desc":"Test",
    "run":[{"type":"switch","ch":1,"value":"off"},{"type":"dimmer","ch":4,"value":100,"speed":"ff"}]
  }
  //console.log("Add JSON")
  //await(lightscene.addOrEdit(s))
  //console.log("Edit String")
  await(lightscene.addOrEdit(st))
  console.log("Execute sved Scene named in CLI")
  await(lightscene.execute(process.argv[2]))
  console.log("execute save Scene by name")
  await(lightscene.execute("Test"))
  enocean.close()
}))
