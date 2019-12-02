var tempReading = 1;
var motionReading = 1;
var soilReading = 1;

function hideTemp() {
    if (tempReading == 0) {
        document.getElementsByClassName("tempSettings")[0].style.display = "none";
        tempReading = 1;
    }
    else if (tempReading == 1) {
        document.getElementsByClassName("tempSettings")[0].style.display = "block";
        tempReading = 0;
    }

}

function hideMotion() {
    if (motionReading == 0) {
        document.getElementsByClassName("motionSettings")[0].style.display = "none";
        motionReading = 1;
    }
    else if (motionReading == 1) {
        document.getElementsByClassName("motionSettings")[0].style.display = "block";
        motionReading = 0;
    }


}
function hideSoil() {
    if (soilReading == 0) {
        document.getElementsByClassName("soilSettings")[0].style.display = "none";
        soilReading = 1;
    }
    else if (soilReading == 1) {
        document.getElementsByClassName("soilSettings")[0].style.display = "block";
        soilReading = 0;
    }
}
function updateTextInput(val) {
    document.getElementById("currentSoil").innerHTML = val + "%";
}

function stateUpdate(newState) {
  console.log(newState);
  // set values here
  var tempAfterMath = Math.ceil(((garden.temp/9.31)-32)/1.8);
  document.getElementById("currentTemp").innerHTML = tempAfterMath + "° ";
  if(garden.moisture > 1870 && garden.moisture < 2300){
    document.getElementById("soilLevel").innerHTML = "Current Soil Moisture Level: Good";
  }
  else if(garden.moisture >2300 && garden.moisture < 2850){
    document.getElementById("soilLevel").innerHTML = "Current Soil Moisture Level: Needs Watering";
  }
  else if (garden.moisture > 2850){
    document.getElementById("soilLevel").innerHTML = "Current Soil Moisture Level: Urgently needs water";
  }

  if(garden.motion == true){
    document.getElementById("wasThereMotion").innerHTML = "Motion detected"
  }
  else if(garden.motion == false){
    document.getElementById("wasThereMotion").innerHTML = "No motion detected"
  }


  if(tempAfterMath<document.getElementById("tempNotification").value){
      console.log("Temperature Alert: Your readings are " + (document.getElementById("tempNotification").value-tempAfterMath) + "° too low." );
  }


  //loadingPage(false);
}

// Have "Loading" appear to transition
function loadingPage(value) {
  document.getElementById("loading").hidden = !value;
  document.getElementById("allComponents").hidden = value;
}

// Initializing different pages and buttons used throughout the application
document.addEventListener("DOMContentLoaded", function(event) {

  // define functions

  // add event listeners

  //loadingPage(true)
  garden.setup()
  garden.setStateChangeListener(stateUpdate)
})
