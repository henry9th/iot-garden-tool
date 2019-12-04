var settingsVisible = 0;

// Function to hide and show the settings div
function hideSettings(){
  if(settingsVisible == 0){
    document.getElementById("settings").style.display = "block";
    document.getElementById("hideButton").style.display= "none";
    document.getElementById("backButton").style.display = "inline-block";
    document.getElementById("dataReadingContent").style.display = "none";
    settingsVisible = 1;
  }
  else if(settingsVisible == 1){
    document.getElementById("settings").style.display = "none";
    document.getElementById("hideButton").style.display= "inline-block";
    document.getElementById("backButton").style.display = "none";
    document.getElementById("dataReadingContent").style.display = "block";
    settingsVisible = 0;
  }
}

function updateTextInput(val) {
    document.getElementById("currentSoil").innerHTML = val + "%";
}

// Each time the state is updated, this displays the current values for Temp/Motion/Soil
function stateUpdate(newState) {
  console.log(newState);
  // set values here
  // Temperature HTML/CSS here
  document.getElementById("currentTemp").innerHTML = garden.temp + "°F";
  if(garden.temp >= 70 && garden.temp <= 88){
    document.getElementById("currentTemp").style.color = "green";
  }
  else if(garden.temp < 70){
    document.getElementById("currentTemp").style.color = "blue";
  }
  else if(garden.temp > 88){
    document.getElementById("currentTemp").style.color= "red";
  }
  if(garden.temp<document.getElementById("tempNotification").value){
      console.log("Temperature Alert: Your readings are " + (document.getElementById("tempNotification").value-garden.temp) + "° too low." );
  }

  // Soil moisture HTML/CSS
  if(garden.moisture < 2300){
    document.getElementById("soilLevel").innerHTML = "Too much water";
    document.getElementById("soilLevel").style.color="blue";
  }
  else if(garden.moisture >2300 && garden.moisture < 2850){
    document.getElementById("soilLevel").innerHTML = "Water level is good";
    document.getElementById("soilLevel").style.color="green";
  }
  else if (garden.moisture > 2850){
    document.getElementById("soilLevel").innerHTML = "Urgently needs water";
    document.getElementById("soilLevel").style.color="red";
  }
// Motion HTML/CSS
  if(garden.motion == true){
    document.getElementById("wasThereMotion").innerHTML = "Motion detected"
    document.getElementById("wasThereMotion").style.color="red";
  }
  else if(garden.motion == false){
    document.getElementById("wasThereMotion").innerHTML = "No motion detected"
    document.getElementById("wasThereMotion").style.color="green";
  }

}

// Have "Loading" appear to transition
function loadingPage(value) {
  document.getElementById("loading").hidden = !value;
  document.getElementById("allComponents").hidden = value;
}

// Initializing different pages and buttons used throughout the application
document.addEventListener("DOMContentLoaded", function(event) {
  garden.setup()
  garden.setStateChangeListener(stateUpdate)
})

// For testing the frightening methods when clicking "Test"
function testFrightening(){
  var e = document.getElementById("frightenValue");
  var strUser = e.options[e.selectedIndex].value;

  if(strUser == "sound"){
    garden.activateSound();
  }
  else if(strUser == "motion"){
    garden.activateMotion();
  }
  else if(strUser == "light"){
    garden.activateLight();
  }
  else{
    console.log(strUser)
  }
}

// Checks first frighten value
function firstFrightSetting(){
  var e = document.getElementById("firstFright");
  var strUser = e.options[e.selectedIndex].value;
  garden.setFirstScare(strUser);

}
// Checks second frighten value
function secondFrightSetting(){
  var e = document.getElementById("firstFright");
  var strUser = e.options[e.selectedIndex].value;
  garden.setSecondScare(strUser);

}
