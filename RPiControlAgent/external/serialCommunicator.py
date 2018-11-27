import sys
import os
import time 

time.sleep(1)
sys.stdout.write("READY")
sys.stdout.flush()

# time.sleep(2)
# sys.stdout.write("ggg")
# sys.stdout.flush()
while True:
    data = sys.stdin.readline()
    sys.stdout.write(data)
    sys.stdout.flush()
