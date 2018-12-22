#include <AFMotor.h>
#include <Servo.h>

// Motors

AF_DCMotor rightMotor(4);
AF_DCMotor leftMotor(1);

Servo cameraY;
Servo cameraX;

// Ultrasonic 
int US_TRIG_PIN = A0;
int US_ECHO_PIN = A1;

// Measurements
int MEASURE_DELAY = 250;
long lastMeasureTime;

// Commands
String FORWARD_CMD = "DRIVE_FORWARD";
String BACKWARD_CMD = "DRIVE_BACKWARD";
String STOP_CMD = "STOP_DRIVING";
String TURN_LEFT_CMD = "TURN_LEFT";
String TURN_RIGHT_CMD = "TURN_RIGHT";
String TILT_UP_CMD = "TILT_UP";
String TILT_DOWN_CMD = "TILT_DOWN";
String TILT_LEFT_CMD = "TILT_LEFT";
String TILT_RIGHT_CMD = "TILT_RIGHT";
String STOP_TILTING = "STOP_TILTING";
String RESET_TILT = "RESET_TILT";

String currentCmd = "";

// Servo
int TILTING_INTERVAL = 20;
int TILTING_ANGLE_FACTOR = 1;
int NONE = 0;
int TILT_UP = 1;
int TILT_DOWN = 2;
int TILT_RIGHT = 1;
int TILT_LEFT = 2;

int xPos;
int yPos;
long lastTiltingTime;
int xTiltDirection;
int yTiltDirection;

void setup() {
  Serial.begin(9600);           // set up Serial library at 9600 bps

  rightMotor.setSpeed(255);
  rightMotor.run(RELEASE);

  leftMotor.setSpeed(255);
  leftMotor.run(RELEASE);

  cameraY.attach(10);
  cameraX.attach(9);
  
  xTiltDirection = NONE;
  yTiltDirection = NONE;
  xPos = 90;
  yPos = 90;
  lastTiltingTime = 0;
//  
//  pinMode(US_TRIG_PIN, OUTPUT);
//  pinMode(US_ECHO_PIN, INPUT);
  lastMeasureTime = 0;
}

void loop() {
  int distanceMeasurement = 0;
  
  currentCmd = nextCommand();
 
  if (currentCmd.equals(FORWARD_CMD)) {
    rightMotor.run(FORWARD);  
    leftMotor.run(FORWARD);
  } else if (currentCmd.equals(STOP_CMD)) {
    leftMotor.run(RELEASE);
    rightMotor.run(RELEASE);
  } else if (currentCmd.equals(BACKWARD_CMD)) {
    rightMotor.run(BACKWARD);  
    leftMotor.run(BACKWARD);
  } else if (currentCmd.equals(TURN_LEFT_CMD)) {
    rightMotor.run(FORWARD);
    leftMotor.run(RELEASE);
  } else if (currentCmd.equals(TURN_RIGHT_CMD)) {
    rightMotor.run(RELEASE);
    leftMotor.run(FORWARD);
  } 

  if (currentCmd.equals(TILT_UP_CMD)) {
    yTiltDirection = TILT_UP;
  } else if (currentCmd.equals(TILT_DOWN_CMD)) {
    yTiltDirection = TILT_DOWN;
  } else if (currentCmd.equals(TILT_RIGHT_CMD)) {
    xTiltDirection = TILT_RIGHT;
  } else if (currentCmd.equals(TILT_LEFT_CMD)) {
    xTiltDirection = TILT_LEFT;
  } else if (currentCmd.equals(STOP_TILTING)) {
    xTiltDirection = NONE;
    yTiltDirection = NONE;
  }
  makeServosMovment();
//
//  if (millis() - lastMeasureTime > MEASURE_DELAY) {
//    lastMeasureTime = millis();
//    distanceMeasurement = measureDistanceCm();
//    String measurements = "{ distance: ";
//    measurements += distanceMeasurement;
//    measurements += " }";
//    Serial.print(measurements);
//  }
}

String nextCommand() {
  String cmd = "";

  if (Serial.available()) {
    cmd = Serial.readStringUntil(';');
  }

  return cmd;
}

void makeServosMovment() {
  if (lastTiltingTime + TILTING_INTERVAL > millis()) 
    return;

  lastTiltingTime = millis();
  
  if (yTiltDirection == TILT_UP) {
    yPos -= TILTING_ANGLE_FACTOR;
    cameraY.write(yPos);
  } else if (yTiltDirection == TILT_DOWN) {
    yPos += TILTING_ANGLE_FACTOR;
    cameraY.write(yPos);
  }

  if (xTiltDirection == TILT_RIGHT) {
    xPos -= TILTING_ANGLE_FACTOR;
    cameraX.write(xPos);
  } else if (xTiltDirection == TILT_LEFT) {
    xPos += TILTING_ANGLE_FACTOR;
    cameraX.write(xPos);
  }
}

int measureDistanceCm() {
  long duration;
  long distanceCm;
  
  digitalWrite(US_TRIG_PIN, LOW);
  delayMicroseconds(5);
  digitalWrite(US_TRIG_PIN, HIGH);
  delayMicroseconds(5);
  digitalWrite(US_TRIG_PIN, LOW);

  duration = pulseIn(US_ECHO_PIN, HIGH);
  distanceCm = (duration / 2) / 29.1;

  return distanceCm;
}
