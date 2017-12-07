import json
import requests 
import time 

# Stores url for Hue Light 1 
light1_url = "http://169.254.82.129/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights/1/state"

requests.put(light1_url, data=json.dumps({"on":True}))

for i in range(0, 650001, 1000):
	print(i)
	requests.put(light1_url, data=json.dumps({"hue":i}))
	time.sleep(0.2)


requests.put(light1_url, data=json.dumps({"on":False}))
