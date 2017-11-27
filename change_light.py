# Functions that will change a single setting on a bulb. Needs URL for it 
# Might turn this into a class 

import requests
import json 

# Turns on light. 
def on_light(url):
	return requests.put(url, data=json.dumps({"on":True}))

# Turns off light 
def off_light(url):
	return requests.put(url, data=json.dumps({"on":False}))

# Changes the color of the light by changing the xy value (check Hue Image guide)
def change_xy(color, url):
	return requests.put(url, data=json.dumps({"on":True, "xy":color}))

# Changes saturation of bulb 
def change_sat(sat, url):
	return requests.put(url, data=json.dumps({"on":True, "sat":sat}))

# Changes brightness of bulb
def change_bri(bri, url):
	return requests.put(url, data=json.dumps({"on":True, "bri":bri}))
