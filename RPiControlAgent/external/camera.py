import socket
import time
import sys
import picamera
import thread

def capture(camera):
    while True:
        cmd = sys.stdin.readline().strip()
        try:
            if (cmd == "CAPTURE"):
                camera.capture(sys.stdout, format="jpeg", use_video_port=True)
                sys.stdout.flush()
        except Exception as err:
            sys.stderr.write(str(err))
            sys.stderr.flush()

client_socket = socket.socket()
client_socket.connect((sys.argv[1], int(sys.argv[2])))

width = int(sys.argv[3])
height = int(sys.argv[4])

# Make a file-like object out of the connection
connection = client_socket.makefile('wb')
try:
    with picamera.PiCamera() as camera:
        camera.resolution = (width, height)
        camera.framerate = 24
        # let the camera warm up for 2 seconds
        time.sleep(2)
        thread.start_new_thread(capture, (camera, ))
        sys.stdout.write("STARTED")
        sys.stdout.flush()
        camera.start_recording(connection, format='h264', profile='baseline', inline_headers=True, bitrate=700000)
        camera.wait_recording(60 * 60 * 24)
        camera.stop_recording()
except Exception as err:
    sys.stdout.write(str(err))
    sys.stdout.flush()
finally:
    connection.close()
    client_socket.close()
