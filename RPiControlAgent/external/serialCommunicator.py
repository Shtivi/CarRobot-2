import sys
import os
import time 

time.sleep(1);
print("READY")
print(str(sys.argv))
print(os.environ['port'])
sys.stdout.flush()

while True:
    data = sys.stdin.readline()
    print("you said ", data)
    sys.stdout.flush()
