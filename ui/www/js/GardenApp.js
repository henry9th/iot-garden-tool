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
    console.log("clicked?")
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
    console.log("clicked?")

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
    console.log("clicked?")
}
function updateTextInput(val) {
    document.getElementById("currentSoil").innerHTML = val + "%";
}

function stateUpdate(newState) {
  console.log(newState);

  // set values here

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
