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
from statistics import median  


chunk = 2048 #1024
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

# Stores the frequency of the data 
freq_data = []

for i in range(0, int(RATE / chunk * RECORD_SECONDS)):
    data = stream.read(chunk)
    Frequency=Pitch(data)

    if i > 12:
    	freq_data.append(Frequency)
    	print(f"{Frequency} Frequency")

# Stores medians of frequencies when analyzed by chunks of 10 
medians = []

for chunk_number in range(0, int(len(freq_data)/10)):

	chunk_array = []

	for j in range(chunk_number * 10, chunk_number * 10 + 9):
		chunk_array.append(freq_data[j])

	medians.append(median(chunk_array))

# Note that will be analyzed 
note = 440

# Counts how many notes are within range 
in_range = 0 

for k in range(0, len(medians)):
	if (note - 10) < medians[k] <= (note + 10): 
		in_range+=1 

# Measures how many medians are within range 
score = (in_range / len(medians)) * 100

print(medians)

# Checks if 50% of notes are within range 
if score > 50:
	print("Green light")
else:
	print("Red light")


# if 435 <= Frequency <= 445:
 #    requests.put("http://192.168.1.173/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights/1/state", data=json.dumps({"on":True, "hue":65500}))
# else:
 #    requests.put("http://192.168.1.173/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights/1/state", data=json.dumps({"on":False}))
#requests.put("http://192.168.1.173/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights/1/state", data=json.dumps({"on":False}))


