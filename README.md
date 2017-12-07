# **Synesthesia **
## **Synopsis**
Our project interacts with Phillips Hue Lightbulbs through sounds and music.  In general, the lightbulb will change color based on the pitch (frequency) that is picked up by the microphone. 

## Getting started 
### How to Interact with Hue 
First, make sure that your bridge and your computer are on the same network, whether it is through a physical ethernet connection to each other or through a router.  

To get a sense of how interacting with the Hue Bridge works, check out the Philips Hue API documentation. Pay special attention to the core concepts. 

The key pieces of information about the bridge that you need to know are the following: 
The IP address of the bridge (will differ from network to network) 
A username for the bridge 
The bulb number that the bridge uses to register your bulb.  

Overall, the URL of the bulb will look something like this: 
```
http://<bridge ip address>/api/<username>/lights/<bulb number>/state
```
This is what you are going to use to communicate with your bulb via HTTP PUT requests. 

After finding out the information for your bulb and making sure that your computer and the Hue Bridge are on the same network, you can now begin to interact with the hue via JavaScript/HTML or Python.  

### Setting up Python
In order to send the PUT request to the Hue Bridge, you will need to have requests and json libraries installed on your computer.  You can install them through the following commands:
```
pip install requests
pip install json 
```
or
```
brew install requests
brew install json 
```

## **Runthrough **
### JavaScript/HTML 
In order to change color based on the frequency, we first created a dictionary that corresponded each of the seven natural notes in an octave to seven distinct Hue values for the Philips Hue light bulb (the Hue value determines the color). We then refer to this dictionary both in the twelve functions (for the twelve different notes in an octave) written at the end of the javascript file and in the code we added to the updatepitch function. 

In the twelve functions and updatePitch, we call the function LightOnHue, which turns on the first lightbulb for natural notes and the second light bulb for sharp notes, turning on the corresponding color for the note. By calling LightOnHue in two different areas, the twelve functions and updatepitch, you have two options in deciding how to turn on the light bulb. The twelve functions way is by clicking the buttons in the HTML, each of which calls a different function within the twelve according to what note it is. The updatepitch way is by turning on live input and starting to sing, thus triggering the LightOnHue function.

Explaining why and how we use a math equation and nine if statements to narrow down pitches to the 4th octave range: to begin, cwilso’s autoCorrelate function calculates the frequency of the user’s voice input. Then, we transform this frequency to fit in the 4th octave range. Using the frequency, we find what note name corresponds to that frequency. Finally, we use the note name to determine what light bulb color the note corresponds to and call the LightOnHue function to turn the light bulb on to that color. Without the math equation and if statements, we would have to calculate the frequency of every single note from C0 to B8 and correspond each of these notes to colors. 

### Python 
If you decide to use the Python files, it will still be able to interact with the Hue bridge.  However, it is important that your computer is on the same network as the Hue.  Also, it is important that you have the URL of the bulb.

#### change_light.py
This library is a way that makes it easy for a user to interact with the lightbulb.  When defining an object, the user would pass in the URL as a string argument to the HueLightBulb class.

```python 
bulb1 = HueLightBulb(“http://169.254.82.129/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights/1/state”)

bulb2 = HueLightBulb(“http://169.254.82.129/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights/2/state”)
```

Here are the methods that apply to the a HueLightBulb object:

```HueLightBulb.status()```
Returns information about the light bulb 

```HueLightBulb.on()```
Turns on the lightbulb 

```HueLightBulb.off()```
Turns off the lightbulb 

```HueLightBulb.change_xy(x_value, y_value)```
Changes the color of the lightbulb based on the given x-y coordinates.  Refer to the gamut over here. 

```HueLightBulb.change_sat(sat)```
Changes the saturation of the bulb. 

```HueLightBulb.change_bri(bri)```
Changes the brightness of the bulb 

```HueLightBulb.change_hue(hue)```
Changes the hue/color of the bulb.  Range from 0 to 65525, inclusive.  
#### pitch_recorder.py
*Majority of effort was focused on developing the pitchdetect.js file, so development of this code was not as prioritized because it will not be used in the final project. 

This program measures whether or not the user hits the target frequency for an inputted frequency value.  The output is displayed as the Hue Bulb glowing green if the user is within +/- 5 hertz of the inputted frequency value.  If the user is outside that interval, the Hue Bulb glows red. 

First, the program takes in input form the user, asking them what is the frequency they want to match with their voice.  Next, it then takes roughly 94 values, recording the sound within a 5-second time interval.  Those 94 values are then stored in an array called freq_data, where a for loop will iterate through that, looking at 10 values at a time, and finding the medians of those 10 values.  After iterating through the array, the medians will be stored in an array called medians, which will then be analyzed to check how many of the values fall within the +/- 5 hertz interval.  What is keeping track of how many medians are in range is the variable called score.  If more than 50% of the medians in the array are within the interval, then light bulb will glow green.  If it doesn’t, it will glow red. 

#### synesthesia_app.py
*Majority of effort was focused on developing the pitchdetect.js file, so development of this code was not as prioritized because it will not be used in the final project. 

This program is creates a graphical user interface (GUI) that enables the user to interact with the bulbs via Python.  On the screen 

Inputted in the beginning is the URL information about the bulb.  The HueLightBulb class from the change_light library is imported to make sending the PUT requests via buttons easier.  A dictionary, notes_to_color, is used to map the notes to certain colors that were selected.  

Various labels and buttons were placed on the GUI based in the need and perceived use by the user at the time of development.  Each button would run a command based on what is said on the button.  For instance, if the button says ‘red light’, then the hue bulb would turn red.  

We wanted the notes to correspond to a certain color, so whenever the button is pressed, the bulb will turn a certain color.  

## **Using the Project**
### Running the website (JavaScript/HTML)
To use the project, simply download the source code to your computer.  

After downloading the source code, simply open the synesthesia.html file.  Because all of the code is written in HTML and JavaScript, there is no backend code that needs run. 

Allow the computer to have access to your microphone, and begin using your voice! 
