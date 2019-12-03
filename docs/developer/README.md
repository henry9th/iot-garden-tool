# Developer Documentation

### Project Setup
The following hardware needs to be wired to a Particle Photon.
- Gikfun Capacitive Soil Moisture Sensor
- PIR sensor
- Servo motor
- Temperature probe
- LED
- Speaker

You would need to configure the pin values in the .ino file to match your specific wiring. The project also uses Particle cloud to send values to the user interface and receive instructions from the user. Ensure that the device id and the Particle access token is configured correctly in Garden.js within the `ui` folder.

### Project modification
The project involves many timers set to different values. These values can all easily be changed as they are defined at the top of the .ino file. Simply change these values to the number of seconds multiplied by 1000 (1000 = 1 sec). For example, if you believe that the strobe light needs to last longer, then simply change the value from 5000 to 10000 (5 sec -> 10 sec).

In the case of a larger modification, such as adding new measurements, that would require you to add the additional wiring, read the value in the `publishState` function and sending that value within the data string. Afterwards, add an additional parameter in the Garden object in `Garden.js` and set that value in the `newGardenEvent` function. It is up to you how you would like to display that value in terms of adding elements in `index.html` and dynamically setting the value in `GardenApp.js`.

If you believe the scare factors are not as effective as you hoped, you have the option to swap out hardware for more extreme counterparts. For example, the speaker could be even louder, or the led could be more powerful. You could also attach something to the Servo motor so that the motions appear larger. 
