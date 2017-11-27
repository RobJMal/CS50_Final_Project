import json
import requests 
import time 

# Stores url for Hue Light 1 
light1_url = "http://169.254.82.129/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights/1/state"

colors = {
	"red" : [0.7, 0.25],
	"orange" : [0.53, 0.38],
	"yellow" : [0.5, 0.41],
	"green" : [0.15, 0.51], 
	"blue" : [0.15, 0.1], 
	"indigo" : [0.2, 0.02],
	"violet" : [0.2300, 0.045]
}

# Changes the color of the light by changing the xy value
# Method learned from https://developers.meethue.com/content/python-requests-library-access-hue-bridge
def change_color(color):
	new_color = {"on":True, "xy":color}

	return requests.put(light1_url, data=json.dumps(new_color))

# Loops through all the colors of the rainbow, based on the xy-value. Changes colors every 1 second. 
for color in colors:
	change_color(colors[color])

	time.sleep(1)

# Turns off light
requests.put(light1_url, data=json.dumps({"on":False}))
