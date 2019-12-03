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
int motionDetected = false;
int soilMoisture = 0;
int temperature = 0;

// Timer for taking measurements and sending data to the cloud
int naturalUpdateTime = 5000;
Timer naturalUpdateTimer(naturalUpdateTime, [](){ publishState(""); });

// Sound alerts
int soundTime = 1000;
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

Timer defaultTimer(10000, [](){ activateSound(""); }, 1);

#define OLED_DC     D3
#define OLED_CS     D4
#define OLED_RESET  D5
Adafruit_SSD1306 display(OLED_DC, OLED_RESET, OLED_CS);
int  x, minX;

void moveServo() {
  servo.attach(D2);

  if (servoAngle == 0) {
    servoAngle = 180;
    servo.write(180);
  } else {
    servoAngle = 0;
    servo.write(0);
  }
}

void stopMotion() {
  motionTimer.stop();
  servo.detach();
}

void stopSound() {
  digitalWrite(soundPin, LOW);
}

int activateSound(String arg) {
  digitalWrite(soundPin, HIGH);
  soundTimer.reset();
}

int activateLight(String arg) {
  strobeTimer.start();
  strobeTotalTimer.start();
}

int activateMotion(String arg) {
  motionTimer.start();
  stopMotionTimer.start();
}


void flipLight() {
  if (digitalRead(lightPin) == HIGH) {
    digitalWrite(lightPin, LOW);
  } else {
    digitalWrite(lightPin, HIGH);
  }
}

void stopStrobe() {
  strobeTimer.stop();
  digitalWrite(lightPin, LOW);
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

  Particle.variable("motionDetected", motionDetected);
  Particle.variable("soilMoisture", soilMoisture);

  Particle.function("activateSound", activateSound);
  Particle.function("activateLight", activateLight);
  Particle.function("activateMotion", activateMotion);
  Particle.function("publishState", publishState);

  display.begin(SSD1306_SWITCHCAPVCC);
  display.setTextSize(7);
  display.setTextColor(WHITE);
  display.setTextWrap(false); // turn off text wrapping so we can do scrolling
  x = display.width(); // set scrolling frame to display width
  minX = -1200;

  naturalUpdateTimer.start();

  temperature = analogRead(tempPin);
}

void loop() {
  display.clearDisplay();
  display.setCursor(x/2, 7);
  display.print("SM: ");
  display.print(String(soilMoisture));
  display.display();
  if(--x < minX) x = display.width()*2;

  if (digitalRead(pirPin) == 0) {
    if (motionDetected == false) {


      motionDetected = true;
    }
  } else {

    motionDetected = false;

  }

}

String topic = "cse222Garden/thisGardenTool";

int publishState(String arg) {

  soilMoisture = analogRead(moisturePin);

  int reading = analogRead(tempPin);
  double voltage = (reading * 3.3) / 4095.0;

  temperature = (voltage - 0.5) * 100;
  double temperatureF = ((temperature * 9.0) / 5.0) + 32.0;

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
  data += "}";

  Serial.println("Publishing:");
  Serial.println(data);

  Particle.publish(topic, data, 60, PRIVATE);
  return 0;
}
