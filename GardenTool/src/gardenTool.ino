/*
 * Project gardenTool
 * Description:
 * Author: Hyunrae Kim and Joel Ki
 * Date:
 */

// SOIL MOISTURE READINGS:
// Dry: 3650
// Wet: 1870

#include <Adafruit_SSD1306.h>

int pirPin = D0;
int soundPin = D1;
int moisturePin = A0;
int lightPin = A1;
int tempPin = A2;

// Measurement values
int motionDetected = 1;
int soilMoisture = 0;
int temperature = 0; // C
int temperatureF = 0; // F

String firstScare = "motion";
String secondScare = "light";

// Timer for taking measurements and sending data to the cloud
int naturalUpdateTime = 5000;
Timer naturalUpdateTimer(naturalUpdateTime, [](){ publishState(""); });

// Sound alerts
int soundTime = 3000;
Timer soundTimer(soundTime, stopSound, 1);

// Motor flipping
Servo servo;
int servoAngle = 0;
int motionUpdateTime = 800;
int motionTotalTime = 5000;
Timer motionTimer(motionUpdateTime, moveServo);
Timer stopMotionTimer(motionTotalTime, stopMotion, 1);

// Light strobing
int strobeIntervalTime = 100;
int strobeTotalTime = 5000;
Timer strobeTimer(strobeIntervalTime, flipLight);
Timer strobeTotalTimer(strobeTotalTime, stopStrobe, 1);

// Timers for automatically scaring wildlife.
Timer firstScareTimer(5000, activateFirstScare, 1);
Timer secondScareTimer(12000, activateSecondScare, 1);

#define OLED_DC     D3
#define OLED_CS     D4
#define OLED_RESET  D5
Adafruit_SSD1306 display(OLED_DC, OLED_RESET, OLED_CS);
int  x, minX;

void activateFirstScare() {
  // Scare based on what the cloud variable is set to

  if (firstScare == "light") {
    activateLight("");
  } else if (firstScare == "motion") {
    activateMotion("");
  } else if (firstScare == "sound") {
    activateSound("");
  }
}

// If first scare did not work, second scare is activated based on what the second scare variable is set to
void activateSecondScare() {
  if (secondScare == "light") {
    activateLight("");
  } else if (secondScare == "motion") {
    activateMotion("");
  } else if (secondScare == "sound") {
    activateSound("");
  }
}

// moves between two angles to mimic a arm swinging motion
void moveServo() {
  if (servoAngle == 0) {
    servoAngle = 180;
    servo.write(180);
  } else {
    servoAngle = 0;
    servo.write(0);
  }
}

// timer for stopping servo. We detatch to remove the noise from the Servo
void stopMotion() {
  motionTimer.stop();
  servo.detach();
}

void stopSound() {
  digitalWrite(soundPin, LOW);
}

int activateSound(String arg) {
  analogWrite(soundPin, 50);
  soundTimer.reset();
}

int activateLight(String arg) {
  strobeTimer.start();
  strobeTotalTimer.start();
}

int activateMotion(String arg) {
  servo.attach(D2);
  motionTimer.start();
  stopMotionTimer.start();
}

// Method for strobing the light. If on, turn off and vice versa
void flipLight() {
  if (digitalRead(lightPin) == HIGH) {
    digitalWrite(lightPin, LOW);
  } else {
    digitalWrite(lightPin, HIGH);
  }
}

// stops the strobing altogether
void stopStrobe() {
  strobeTimer.stop();
  digitalWrite(lightPin, LOW);
}

// cloud function for users in the UI to set their preference for automatic scares
int setFirstScare(String arg) {
  firstScare = arg;
}

int setSecondScare(String arg) {
  secondScare = arg;
}


// setup() runs once, when the device is first turned on.
void setup() {

  // Put initialization like pinMode and begin functions here.
  pinMode(pirPin, INPUT);
  pinMode(soundPin, OUTPUT);
  pinMode(moisturePin, INPUT);
  pinMode(lightPin, OUTPUT);
  pinMode(tempPin, INPUT);

  servo.attach(D2);

  // Cloud variables
  Particle.variable("motionDetected", motionDetected);
  Particle.variable("soilMoisture", soilMoisture);
  Particle.variable("temperature", temperature);
  Particle.variable("firstScare", firstScare);
  Particle.variable("secondScare", secondScare);

  // Cloud functions
  Particle.function("activateSound", activateSound);
  Particle.function("activateLight", activateLight);
  Particle.function("activateMotion", activateMotion);
  Particle.function("publishState", publishState);
  Particle.function("setFirstScare", setFirstScare);
  Particle.function("secSecondScare", setSecondScare);

  // Adafruit display setup
  display.begin(SSD1306_SWITCHCAPVCC);
  display.setTextSize(7);
  display.setTextColor(WHITE);
  display.setTextWrap(false); // turn off text wrapping so we can do scrolling
  x = display.width(); // set scrolling frame to display width
  minX = -1800;

  // start the timer for periodically sending data to the cloud
  naturalUpdateTimer.start();

  // initial temperature reading
  temperature = analogRead(tempPin);
}

void loop() {

  display.clearDisplay();
  display.setCursor(x/2, 7);

  // Display a message regarding whether the garden is in a healthy state or not
  if (soilMoisture >= 2300 && soilMoisture <= 2850 && temperatureF >= 70 && temperatureF <= 88 && motionDetected == 1) {
    display.print("Garden is healthy!");
  } else {
    display.print("Garden needs attention");
  }
  display.display();
  if(--x < minX) x = display.width()*2;


  // logic for detecting motion and starting the automatic scare timers if there has been new motion
  if (digitalRead(pirPin) == 1) {
    if (!secondScareTimer.isActive()) {
      firstScareTimer.reset();
      secondScareTimer.reset();
      motionDetected = 0;
    }
  } else {
    // stop the timers if there's no more motion
    firstScareTimer.stop();
    secondScareTimer.stop();
    motionDetected = 1;
  }
}

String topic = "cse222Garden/thisGardenTool";

int publishState(String arg) {

  soilMoisture = analogRead(moisturePin);

  int reading = analogRead(tempPin);
  double voltage = (reading * 3.3) / 4095.0;

  // convert voltage to temperature.
  temperature = (voltage - 0.5) * 100;
  temperatureF = ((temperature * 9.0) / 5.0) + 32.0;

  String data = "{";

  if(motionDetected == 0) {
    data += "\"motion\":true";
  } else {
    data += "\"motion\":false";
  }
  data += ", ";
  data += "\"moisture\":";
  data += soilMoisture;
  data += ", ";
  data += "\"temp\":";
  data += String(temperatureF);
  data += ", ";
  data += "\"firstScare\":";
  data += "\"" + firstScare + "\"";
  data += ", ";
  data += "\"secondScare\":";
  data += "\"" + secondScare + "\"";
  data += "}";

  Serial.println("Publishing:");
  Serial.println(data);

  Particle.publish(topic, data, 60, PRIVATE);
  return 0;
}
