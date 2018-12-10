import sys
import picamera
import time

with picamera.PiCamera() as camera:
    camera.resolution = (sys.argv[1], sys.argv[2])
    camera.capture(sys.stdout, use_video_port=True)
    sys.stdout.flush()