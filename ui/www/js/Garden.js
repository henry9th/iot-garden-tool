var myParticleAccessToken = "8af5e881c4b3f6ab1f5cc9d4fdd1be463cb6a26b"
var myDeviceId =            "37002a000647363332363639"
var topic =                 "cse222Garden/thisGarden"

// Whenever event streams are published, parses the data to use on the UI side.
function newGardenEvent(objectContainingData) {

      console.dir(objectContainingData);
      try {
        var data = JSON.parse(objectContainingData.data);

      } catch (e) {
        console.log(e);
      }

      if (data) {
        garden.temp = parseInt(data.temp);
        garden.motion = data.motion;
        garden.moisture = parseInt(data.moisture);
      }
      garden.stateChange()
}
// Setting functions to activate the motion, sound, and light sensors. Also functions for setting the intial scare type and secondary scare type.
var garden = {
  temp: 0,
  motion: false,
  moisture: 0,
  stateChangeListener: null,

  activateMotion: function() {
    var functionData = {
      deviceId:myDeviceId,
      name: "activateMotion",
      argument: "true",
      auth: myParticleAccessToken
    }
    function onSuccess(e) { console.log("activateMotion call success") }
    function onFailure(e) { console.log("activateMotion call failed")
                       console.dir(e) }
    particle.callFunction(functionData).then(onSuccess,onFailure)
  },
  activateSound: function() {
    var functionData = {
      deviceId:myDeviceId,
      name: "activateSound",
      argument: "true",
      auth: myParticleAccessToken
    }
    function onSuccess(e) { console.log("activateMotion call success") }
    function onFailure(e) { console.log("activateMotion call failed")
                       console.dir(e) }
    particle.callFunction(functionData).then(onSuccess,onFailure)
  },
  activateLight: function() {
    var functionData = {
      deviceId:myDeviceId,
      name: "activateLight",
      argument: "true",
      auth: myParticleAccessToken
    }
    function onSuccess(e) { console.log("activateMotion call success") }
    function onFailure(e) { console.log("activateMotion call failed")
                       console.dir(e) }
    particle.callFunction(functionData).then(onSuccess,onFailure)
  },
  setFirstScare: function(firstScare) {
    var functionData = {
      deviceId:myDeviceId,
      name: "setFirstScare",
      argument: firstScare,
      auth: myParticleAccessToken
    }
    function onSuccess(e) { console.log("activateMotion call success") }
    function onFailure(e) { console.log("activateMotion call failed")
                       console.dir(e) }
    particle.callFunction(functionData).then(onSuccess,onFailure)
  },
  setSecondScare: function(secondScare) {
    var functionData = {
      deviceId:myDeviceId,
      name: "setFirstScare",
      argument:  secondScare,
      auth: myParticleAccessToken
    }
    function onSuccess(e) { console.log("activateMotion call success") }
    function onFailure(e) { console.log("activateMotion call failed")
                       console.dir(e) }
    particle.callFunction(functionData).then(onSuccess,onFailure)
  },

  setStateChangeListener: function(aListener) {
    this.stateChangeListener = aListener;
    //this.stateChange();
  },
// Updates the state changes.
  stateChange: function() {
    var callingObject = this
    if(callingObject.stateChangeListener) {

      var state = {
        temp: this.temp,
        motion: this.motion,
        moisture: this.moisture
      };

      callingObject.stateChangeListener(state)
    }
  },
  setup: function() {
      // Create a particle object
      particle = new Particle();

      var that = this;

      function onSuccess(stream) {
        // DONE:  This will "subscribe' to the stream and get the state"
        console.log("getEventStream success")
        stream.on('event', newGardenEvent)
        // TODO: Get the initial state.  Call your function that will publish the state
        var functionData = {
          deviceId:myDeviceId,
          name: "publishState",
          argument: "",
          auth: myParticleAccessToken
        }
        function onSuccess(e) { console.log("publishState call success") }
        function onFailure(e) { console.log("publishState call failed")
                           console.dir(e) }
        particle.callFunction(functionData).then(onSuccess,onFailure)
      }
      function onFailure(e) { console.log("getEventStream call failed")
                              console.dir(e) }
      // Subscribe to the stream
      particle.getEventStream( { name: topic, auth: myParticleAccessToken, deviceId: 'mine' }).then(onSuccess, onFailure)
    }
}
