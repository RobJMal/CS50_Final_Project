import tkinter as tk
from change_light import HueLightBulb
import change_light
import json
import requests

bulb1 = HueLightBulb("http://169.254.82.129/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights")

window = tk.Tk()
window.title("Synthesia")
window.geometry("500x500")

# Dictionary that stores colors for xy values 
notes_to_color = {
	"C": [0.1, 0.7], 
	"C#": [0.25, 0.41],
	"Db": [0.25, 0.41],
	"D": [0.1, 0.24], 
	"D#": [1.9, 0.6],
	"Eb": [1.9, 0.6], 
	"E": [0.3, 0.9],
	"F": [0.21, 0.2],
	"F#": [0.25, 0.5],
	"Gb": [0.25, 0.5],
	"G": [0.7, 0.26],
	"G#": [0.6, 0.36],
	"Ab": [0.6, 0.36],
	"A": [0.58, 0.4],
	"A#": [0.4, 0.54],
	"Bb": [0.4, 0.54],
	"B": [0.5, 0.49]
}


#-----LABELS--------
intro_label = tk.Label(text="Welcome to our app!")
intro_label.grid()

colors_label = tk.Label(text="Try out these different colors!")
intro_label.grid(column=0, row=2)

notes_label = tk.Label(text="Here are the notes to lights!")
notes_label.grid(column=0, row=4)

#-----BUTTONS-------
on_light_btn = tk.Button(text="On light", command=bulb1.on)
on_light_btn.grid(column=0, row=1)

off_light_btn = tk.Button(text="Off light", command=bulb1.off)
off_light_btn.grid(column=1, row=1)

# Primary color lights 
red_light_btn = tk.Button(text="Red Light", command= lambda: bulb1.change_hue(65280))
red_light_btn.grid(column=0, row=3)

blue_light_btn = tk.Button(text="Blue Light", command= lambda: bulb1.change_hue(46920))
blue_light_btn.grid(column=1, row=3)

green_light_btn = tk.Button(text="Green Light", command= lambda: bulb1.change_hue(25500))
green_light_btn.grid(column=2, row=3)

# Note color lights
c_btn = tk.Button(text="C", command= lambda: bulb1.change_xy(notes_to_color["C"]))
c_btn.grid(column=0, row=5)

cshpdb_btn = tk.Button(text="C#/Db", command= lambda: bulb1.change_xy(notes_to_color["C#"]))
c_btn.grid(column=1, row=5)

d_btn = tk.Button(text="D", command= lambda: bulb1.change_xy(notes_to_color["D"]))
d_btn.grid(column=2, row=5)

dshpeb_btn = tk.Button(text="D#/Eb", command= lambda: bulb1.change_xy(notes_to_color["D#/Eb"]))
dshpeb_btn.grid(column=3, row=5)

e_btn = tk.Button(text="E", command= lambda: bulb1.change_xy(notes_to_color["E"]))
e_btn.grid(column=4, row=5)

f_btn = tk.Button(text="F", command= lambda: bulb1.change_xy(notes_to_color["F"]))
f_btn.grid(column=0, row=6)

fshpgb_btn = tk.Button(text="F#/Gb", command= lambda: bulb1.change_xy(notes_to_color["F#/Gb"]))
fshpgb_btn.grid(column=1, row=6)

g_btn = tk.Button(text="G", command= lambda: bulb1.change_xy(notes_to_color["G"]))
g_btn.grid(column=2, row=6)

gshpab_btn = tk.Button(text="G#/Ab", command= lambda: bulb1.change_xy(notes_to_color["G#/Ab"]))
gshpab_btn.grid(column=3, row=6)

a_btn = tk.Button(text="A", command= lambda: bulb1.change_xy(notes_to_color["A"]))
a_btn.grid(column=4, row=6)

ashpbb_btn = tk.Button(text="A#/Bb", command= lambda: bulb1.change_xy(notes_to_color["A#"]))
ashpbb_btn.grid(column=0, row=7)
 
b_btn = tk.Button(text="B", command= lambda: bulb1.change_xy(notes_to_color["B"]))
b_btn.grid(column=1, row=7)

window.mainloop()