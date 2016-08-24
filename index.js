var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Button = require('node-enocean-button')
var Dimmer = require('node-enocean-dimmer')
var delay = require('timeout-as-promise');

const fs = require("fs.promised");
var scenes = require("./data/scenes.json")
function Lightscene(app){
  this.app = app
  this.addOrEdit=async(function(scene){
    if((typeof scene)=="string"){
      scene = this.string2JSON(scene)
    }
    scenes[scene.name]=scene
    await(this.saveScenes())
  })
  this.string2JSON=function(st){
    // Name: s 1 on,d 4 50,d 4 off,d 4 40 01
    st=st.trim()
    var n=st.split(":")
    var s={}
    s.name = n[0].trim()
    s.run=[]
    var v = n[1].trim().split(",")
    for(var i = 0; i<v.length;i++){
      var b = v[i].trim().split(" ")
      var r ={
        "type": b[0],
        "ch": b.length<3 ? null:b[1],
        "value": b.length<3 ? b[1]:b[2]
      }
      if(b.length>3){
        r.speed=b[3]
      }
      s.run.push(r)
    }
    return s
  }
  this.remove=async(function(scene){
    delete scenes[scene.name]
    await(this.saveScenes())
  })
  this.execute=async(function(nameOrNumber){
    var scene=scenes[nameOrNumber]
    await(this.executeJSON(scene))
  })
  this.executeJSON=async(function(scene){
    for(var i = 0;i<scene.run.length;i++){
      item=scene.run[i]
      switch(item.type){
        case "s":
        case "switch":
          var b = new Button(app,item.ch)
          if(item.value=="on"){
            await(b.A1.click())
          }else{
            await(b.A0.click())
          }
        break;
        case "d":
        case "dimmer":
          var d = new Dimmer(app,item.ch)
          if(item.speed) d.speed=item.speed
          if(item.value=="off"){
            await(d.off())
          }else{
            await(d.setValue(item.value))
          }
        break;
        case "w":
        case "wait":
          await(delay(item.value))
        break;
      }
    }
  })
  this.executeString=async(function(scene){
    scene = this.string2JSON(scene)
    await(this.executeJSON(scene))
  })
  this. saveScenes=async(function (){
    try{
      await(fs.writeFile( "./data/scenes.json" , JSON.stringify( scenes , null , 4 )))
    }catch(err){
      console.log("could not write to file")
    }
  })
}

module.exports= Lightscene
