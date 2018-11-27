import sys
import os
import time 
import json
# import serial

# serial = serial.Serial(os.environ['port'])

sys.stdout.write("READY")
sys.stdout.flush()

while True:
    data = sys.stdin.readline()
    try:
        if len(data) > 0:
            raise Exception('got an input!')
            # ser.write(data)
    except Exception as err:
        sys.stderr.write(json.dumps({"error": str(err)}))
        sys.stderr.flush()