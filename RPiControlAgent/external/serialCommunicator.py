import sys
import os
import time 
import json
import serial

serialPort = serial.Serial(os.environ['port'])

sys.stdout.write("READY")
sys.stdout.flush()

while True:
    cmd = sys.stdin.readline().strip()
    try:
        if (len(cmd) > 0):
            serialPort.write(cmd)
            serialPort.flush()
        # incomingMsg = serialPort.readline()
        # if (len(incomingMsg) > 0):
        #     sys.stdout.write(json.dumps({"incoming": incomingMsg}))
        #     sys.stdout.flush()
    except Exception as err:
        sys.stderr.write(json.dumps({"error": str(err)}))
        sys.stderr.flush()