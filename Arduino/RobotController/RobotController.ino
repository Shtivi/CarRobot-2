#include <AFMotor.h>

AF_DCMotor rightMotor(4);
AF_DCMotor leftMotor(1, MOTOR12_1KHZ);

String FORWARD_CMD = "DRIVE_FORWARD";
String BACKWARD_CMD = "DRIVE_BACKWARD";
String STOP_CMD = "STOP_DRIVING";
String TURN_LEFT_CMD = "TURN_LEFT";
String TURN_RIGHT_CMD = "TURN_RIGHT";

String currentCmd = "";

void setup() {
  Serial.begin(9600);           // set up Serial library at 9600 bps

  rightMotor.setSpeed(255);
  rightMotor.run(RELEASE);

  leftMotor.setSpeed(255);
  leftMotor.run(RELEASE);
}

void loop() {
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
}

String nextCommand() {
  String cmd = "";

  if (Serial.available()) {
    cmd = Serial.readStringUntil(';');
  }

  return cmd;
}
