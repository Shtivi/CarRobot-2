import socket
import time
import sys
import picamera
import thread

uri = sys.argv[1]
port = int(sys.argv[2])
width = int(sys.argv[3])
height = int(sys.argv[4])
capture_path = sys.argv[5]

class CaptureWriter:
    def write(self, data):
        output_file = open(capture_path, "wb")
        output_file.write(data)
        sys.stdout.write("CAPTURED\n\r")
    
    def flush(self):
        sys.stdout.flush()

def format_exception(err):
    exc_type, exc_value, exc_traceback = sys.exc_info()
    return (str(err) + " [line: " + str(exc_traceback.tb_lineno) + "]")

def print_exception(err):
    sys.stderr.write(format_exception(err))
    sys.stderr.flush()

def listen_for_captures(camera):
    writer = CaptureWriter()
    while True:
        cmd = sys.stdin.readline().strip()
        try:
            if (cmd == "CAPTURE"):
                camera.capture(writer, format="jpeg", use_video_port=True)
        except Exception as err:
            sys.stdout.write(format_exception(err))
            sys.stdout.flush()

client_socket = socket.socket()
client_socket.connect((uri, port))

# Make a file-like object out of the connection
connection = client_socket.makefile('wb')
try:
    with picamera.PiCamera() as camera:
        camera.resolution = (width, height)
        camera.framerate = 24
        # let the camera warm up for 2 seconds
        time.sleep(2)
        thread.start_new_thread(listen_for_captures, (camera, ))
        sys.stdout.write("STARTED")
        sys.stdout.flush()
        camera.start_recording(connection, format='h264', profile='baseline', inline_headers=True, bitrate=700000)
        camera.wait_recording(60 * 60 * 24)
        camera.stop_recording()
except Exception as err:
    print_exception(err)
finally:
    connection.close()
    client_socket.close()
