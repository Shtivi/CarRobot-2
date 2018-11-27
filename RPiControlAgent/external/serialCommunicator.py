import sys
import os
import time 
import json
import serial

serial = serial.Serial(os.environ['port'])

sys.stdout.write("READY")
sys.stdout.flush()

while True:
    cmd = sys.stdin.readline()
    try:
        if (len(cmd) > 0):
            serial.write(cmd)
            serial.flush()
        incomingMsg = serial.readline()
        if (len(incomingMsg) > 0):
            sys.stdout.write(json.dumps({"incoming": incomingMsg}))
            sys.stdout.flush()
    except Exception as err:
        sys.stderr.write(json.dumps({"error": str(err)}))
        sys.stderr.flush()