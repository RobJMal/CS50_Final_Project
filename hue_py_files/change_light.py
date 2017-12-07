# Functions that will change a single setting on a bulb. Needs URL for it 
# FILE IS STILL IN ITS PROTOTYPE STAGE. BULB # FOR BRIDGE NEEDS TO BE DYNAMIC  

import requests
import json 

class HueLightBulb:

	# Must follow the following format: 
	#http://<bridge ip address>/api/<username>/lights/<bulb number>/state
	def __init__(self, url):
		self.url = url

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
	def change_xy(self, x_val, y_val):
		return requests.put(self.url, data=json.dumps({"on":True, "xy":[x_val, y_val]}))

	# Changes saturation of bulb 
	def change_sat(self, sat):
		return requests.put(self.url, data=json.dumps({"on":True, "sat":sat}))

	# Changes brightness of bulb
	def change_bri(self, bri):
		return requests.put(self.url, data=json.dumps({"on":True, "bri":bri}))

	# Changes the hue of bulb
	def change_hue(self, hue):
		return requests.put(self.url, data=json.dumps({"on":True, "hue":hue}))

