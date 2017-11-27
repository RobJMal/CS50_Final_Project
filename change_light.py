# Functions that will change a single setting on a bulb. Needs URL for it 
# FILE IS STILL IN ITS PROTOTYPE STAGE. BULB # FOR BRIDGE NEEDS TO BE DYNAMIC  

import requests
import json 

class HueLightBulb:

	# NEED TO MAKE THE BULB NUMBER DYNAMIC 
	def __init__(self, url):
		self.url = url + "/1/state"

	# Returns status of bulb 
	def status(self):

		# Removes "/state" at end of url 
		return request.get(url.replace(" ","")[:-6])

	# Turns on light. 
	def on(self):
		return requests.put(url, data=json.dumps({"on":True}))
	
	# Turns off light 
	def off(self):
		return requests.put(url, data=json.dumps({"on":False}))

	# Changes the color of the light by changing the xy value (check Hue Image guide)
	def change_xy(self, color):
		return requests.put(url, data=json.dumps({"on":True, "xy":color}))

	# Changes saturation of bulb 
	def change_sat(self, sat):
		return requests.put(url, data=json.dumps({"on":True, "sat":sat}))

	# Changes brightness of bulb
	def change_bri(self, bri):
		return requests.put(url, data=json.dumps({"on":True, "bri":bri}))

