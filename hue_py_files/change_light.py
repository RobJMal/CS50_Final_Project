# Functions that will change a single setting on a bulb. Needs URL for it 
# FILE IS STILL IN ITS PROTOTYPE STAGE. BULB # FOR BRIDGE NEEDS TO BE DYNAMIC  

import requests
import json 

requests.put("http://169.254.82.129/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights/1/state", data=json.dumps({"on":True, "xy":[0.5, 0.5]}))

class HueLightBulb:

	# NEED TO MAKE THE BULB NUMBER DYNAMIC 
	def __init__(self, url):
		self.url = url + "/1/state"

	# Returns status of bulb 
	def status(self):

		# Removes "/state" at end of url 
		return requests.get(self.url.replace(" ","")[:-6]).text

	# Turns on light. 
	def on(self):
		return requests.put(self.url, data=json.dumps({"on":True}))
	
	# Turns off light 
	def off(self):
		return requests.put(self.url, data=json.dumps({"on":False}))

	# Changes the color of the light by changing the xy value (check Hue Image guide)
	def change_xy(self, color):
		return requests.put(self.url, data=json.dumps({"on":True, "xy":color}))

	# Changes saturation of bulb 
	def change_sat(self, sat):
		return requests.put(self.url, data=json.dumps({"on":True, "sat":sat}))

	# Changes brightness of bulb
	def change_bri(self, bri):
		return requests.put(self.url, data=json.dumps({"on":True, "bri":bri}))

	# Changes the hue of bulb
	def change_hue(self, hue):
		return requests.put(self.url, data=json.dumps({"on":True, "hue":hue}))

# notes_to_xy = {
# 	"C": [0.1, 0.7], 
# 	C#/Db: [0.25, 0.41],
# 	D: [0.1, 0.24],
# 	D#/Eb: [1.9, 0.6],
# 	E: [0.3, 0.9],
# 	F: [0.21, 0.2],
# 	F#/Gb: [0.25, 0.5],
# 	G: [0.7, 0.26],
# 	G#/Ab: [0.6, 0.36],
# 	A: [0.58, 0.4],
# 	A#/Bb: [0.4, 0.54],
# 	B: [0.5, 0.49],
# }


# Always validate argumetns
# Check out edge cases
# Create documentation 
# Write descriptive comments 
# 3 times a row, generalize it 

# Check python documentation 