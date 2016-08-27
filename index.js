const Button = require('node-enocean-button')
const Dimmer = require('node-enocean-dimmer')
const Actuator = require('node-enocean-button-actuator')

const async = require('asyncawait/async');
const await = require('asyncawait/await');
const delay = require('timeout-as-promise');
const fs = require("fs.promised");

function Lightscene(app,options = {sceneFile:"./data/scenes.json"}){
  this.scenes = require(options.sceneFile)
  this.actuators = []
  for(item in this.scenes){
    if(this.scenes[item].listener!=undefined)
    this.scenes[item].listener.forEach(function(item2){
      var a = new Actuator(app)
      a.id=item2.id
      this.actuators.push(a)
      a.sceneRunner=this
      a.scene=item
      a.button=item2.button
      a.click=function(data){if(this.button==data.button) this.sceneRunner.execute(this.scene)}
    }.bind(this))
  }
  this.app = app
  this.addOrEdit=async(function(scene){
    if((typeof scene)=="string"){
      scene = this.string2JSON(scene)
    }
    this.scenes[scene.name]=scene
    this.actuators.forEach(function(item,index){
      if(item.scene==scene.name){
        this.actuators.splice(index,1)
      }
    }.bind(this))
    if(scene.listener!=undefined)
    scene.listener.forEach(function(item2){
      var a = new Actuator(app)
      a.id=item2.id
      this.actuators.push(a)
      a.sceneRunner=this
      a.scene=scene.name
      a.button=item2.button
      a.click=function(data){if(this.button==data.button) this.sceneRunner.execute(this.scene)}
    }.bind(this))
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
    delete this.scenes[scene.name]
    await(this.saveScenes())
  })
  this.execute=async(function(nameOrNumber){
    var scene=this.scenes[nameOrNumber]
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
      await(fs.writeFile( options.sceneFile , JSON.stringify( this.scenes , null , 4 )))
    }catch(err){
      console.log("could not write to file")
    }
  })
  this.addListener=function (sceneName,listener){
    // // Interface not ready! DONT USE
    // var scene = this.scenes[sceneName]
    // if(scene.listener==undefined) scene.listener=[]
    // scene.listener.push(listener)
    // var a = new Actuator(this.app)
    // a.id=listener.sensorId
    // this.actuators.push(a)
    // a.sceneRunner=this
    // a.scene=item
    // a.button=listener.button
    // a.click=function(data){if(this.button==data.button) this.sceneRunner.execute(this.scene)}
    // this.saveScenes()
  }
}

module.exports= Lightscene
