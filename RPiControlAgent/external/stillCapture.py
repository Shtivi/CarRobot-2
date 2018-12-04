import sys
import picamera
import time

width = sys.argv[1];
height = sys.argv[2];

with picamera.PiCamera() as camera:
    camera.resolution = (width, height)
    camera.capture(sys.stdout, use_video_port=True)
    sys.stdout.flush()