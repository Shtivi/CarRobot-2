#include <AFMotor.h>
#include <Servo.h>

AF_DCMotor rightMotor(4);
AF_DCMotor leftMotor(1);

Servo cameraY;
Servo cameraX;

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
int ROTATION_SPEED = 5;

int xPos = 0;
int yPos = 0;
String currentCmd = "";

void setup() {
  Serial.begin(9600);           // set up Serial library at 9600 bps

  rightMotor.setSpeed(255);
  rightMotor.run(RELEASE);

  leftMotor.setSpeed(255);
  leftMotor.run(RELEASE);

  cameraX.attach(10);
  cameraY.attach(9);
  
  cameraX.write(96);
  cameraY.write(90);
  
  Serial.write("starting");

}

void loop() {
//  cameraY.write(80);
//  Serial.write((int)cameraY.read());
//  delay(500);
//  cameraY.write(90);
//  Serial.write((int)cameraY.read());
//  delay(1000);

//  cameraY.write(85);
//  delay(500);
//  cameraY.write(90);
//  delay(1000);
  
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
    cameraY.write(90 - ROTATION_SPEED);
  } else if (currentCmd.equals(TILT_DOWN_CMD)) {
    cameraY.write(90 + ROTATION_SPEED);
  } else if (currentCmd.equals(TILT_RIGHT_CMD)) {
//    cameraX.write(96 - ROTATION_SPEED);
  } else if (currentCmd.equals(TILT_LEFT_CMD)) {
//    cameraX.write(96 + ROTATION_SPEED);
  } else if (currentCmd.equals(STOP_TILTING)) {
    cameraX.write(96);
    cameraY.write(90);
  }
}

String nextCommand() {
  String cmd = "";

  if (Serial.available()) {
    cmd = Serial.readStringUntil(';');
  }

  return cmd;
}
