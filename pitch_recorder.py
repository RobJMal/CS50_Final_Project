# Code comes from here https://stackoverflow.com/questions/9082431/frequency-analysis-in-python

import audioop
#Eng Eder de Souza 01/12/2011
#ederwander
from matplotlib.mlab import find
import pyaudio
import numpy as np
import math
import requests
import json 


chunk = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
RECORD_SECONDS = 5


def Pitch(signal):
    signal = np.fromstring(signal, 'Int16');
    crossing = [math.copysign(1.0, s) for s in signal]
    index = find(np.diff(crossing));
    f0=round(len(index) *RATE /(2*np.prod(len(signal))))
    return f0;


p = pyaudio.PyAudio()

stream = p.open(format = FORMAT,
channels = CHANNELS,
rate = RATE,
input = True,
output = True,
frames_per_buffer = chunk)

for i in range(0, int(RATE / chunk * RECORD_SECONDS)):
    data = stream.read(chunk)
    Frequency=Pitch(data)
    if 435 <= Frequency <= 445:
  	    requests.put("http://192.168.1.173/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights/1/state", data=json.dumps({"on":True, "hue":65500}))
    else:
  	    requests.put("http://192.168.1.173/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights/1/state", data=json.dumps({"on":False}))
    print(f"{Frequency} Frequency")


requests.put("http://192.168.1.173/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights/1/state", data=json.dumps({"on":False}))


