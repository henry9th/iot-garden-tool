function stateUpdate(newState) {
  console.log(newState);

  // set values here

  loadingPage(false);
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

  loadingPage(true)
  garden.setup()
  garden.setStateChangeListener(stateUpdate)
})
