import sys
import picamera
import time

with picamera.PiCamera() as camera:
    camera.resolution = (sys.argv[1], sys.argv[2])
    time.sleep(0.2)
    camera.capture("/home/pi/CarRobot-2/RPiControlAgent/external/hi.jpeg", format="jpeg", use_video_port=True)