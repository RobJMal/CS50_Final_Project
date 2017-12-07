// Code is obtained from https://github.com/cwilso/PitchDetect

/*
The MIT License (MIT)

Copyright (c) 2014 Chris Wilson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

window.AudioContext = window.AudioContext || window.webkitAudioContext;

// Sets the url for the lightbulb 
let url = "http://169.254.82.129/api/99MmFck8z1xaA3jvKD1oJD8wVvYyr3iZdOY4vw1U/lights/1/state";

var audioContext = null;
var isPlaying = false;
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var DEBUGCANVAS = null;
var mediaStreamSource = null;
var detectorElem, 
	canvasElem,
	waveCanvas,
	pitchElem,
	noteElem,
	detuneElem,
	detuneAmount;

window.onload = function() {
	audioContext = new AudioContext();
	MAX_SIZE = Math.max(4,Math.floor(audioContext.sampleRate/5000));	// corresponds to a 5kHz signal
	var request = new XMLHttpRequest();
	request.open("GET", "../sounds/whistling3.ogg", true);
	request.responseType = "arraybuffer";
	request.onload = function() {
	  audioContext.decodeAudioData( request.response, function(buffer) { 
	    	theBuffer = buffer;
		} );
	}
	request.send();

	detectorElem = document.getElementById( "detector" );
	canvasElem = document.getElementById( "output" );
	DEBUGCANVAS = document.getElementById( "waveform" );
	if (DEBUGCANVAS) {
		waveCanvas = DEBUGCANVAS.getContext("2d");
		waveCanvas.strokeStyle = "black";
		waveCanvas.lineWidth = 1;
	}
	pitchElem = document.getElementById( "pitch" );
	noteElem = document.getElementById( "note" );
	detuneElem = document.getElementById( "detune" );
	detuneAmount = document.getElementById( "detune_amt" );

	detectorElem.ondragenter = function () { 
		this.classList.add("droptarget"); 
		return false; };
	detectorElem.ondragleave = function () { this.classList.remove("droptarget"); return false; };
	detectorElem.ondrop = function (e) {
  		this.classList.remove("droptarget");
  		e.preventDefault();
		theBuffer = null;

	  	var reader = new FileReader();
	  	reader.onload = function (event) {
	  		audioContext.decodeAudioData( event.target.result, function(buffer) {
	    		theBuffer = buffer;
	  		}, function(){alert("error loading!");} ); 

	  	};
	  	reader.onerror = function (event) {
	  		alert("Error: " + reader.error );
		};
	  	reader.readAsArrayBuffer(e.dataTransfer.files[0]);
	  	return false;
	};



}

function error() {
    alert('Stream generation failed.');
}

function getUserMedia(dictionary, callback) {
    try {
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;
        navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to the destination.
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect( analyser );
    updatePitch();
}

function toggleOscillator() {
    if (isPlaying) {
        //stop playing and return
        sourceNode.stop( 0 );
        sourceNode = null;
        analyser = null;
        isPlaying = false;
		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
        window.cancelAnimationFrame( rafID );
        return "play oscillator";
    }
    sourceNode = audioContext.createOscillator();

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    sourceNode.connect( analyser );
    analyser.connect( audioContext.destination );
    sourceNode.start(0);
    isPlaying = true;
    isLiveInput = false;
    updatePitch();

    return "stop";
}

function toggleLiveInput() {
    if (isPlaying) {
        //stop playing and return
        sourceNode.stop( 0 );
        sourceNode = null;
        analyser = null;
        isPlaying = false;
		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
        window.cancelAnimationFrame( rafID );
    }
    getUserMedia(
    	{
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream);
}

function togglePlayback() {
    if (isPlaying) {
        //stop playing and return
        sourceNode.stop( 0 );
        sourceNode = null;
        analyser = null;
        isPlaying = false;
		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
        window.cancelAnimationFrame( rafID );
        return "start";
    }

    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = theBuffer;
    sourceNode.loop = true;

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    sourceNode.connect( analyser );
    analyser.connect( audioContext.destination );
    sourceNode.start( 0 );
    isPlaying = true;
    isLiveInput = false;
    updatePitch();

    return "stop";
}

var rafID = null;
var tracks = null;
var buflen = 1024;
var buf = new Float32Array( buflen );

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Calculates the note from the pitch 
function noteFromPitch( frequency ) {
	var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
	return Math.round( noteNum ) + 69;
}

// Calculates the frequency from the note 
function frequencyFromNoteNumber( note ) {
	return 440 * Math.pow(2,(note-69)/12);
}

// Calculates how for user is from exact pitch 
function centsOffFromPitch( frequency, note ) {
	return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
}

var MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.
var GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be

function autoCorrelate( buf, sampleRate ) {
	var SIZE = buf.length;
	var MAX_SAMPLES = Math.floor(SIZE/2);
	var best_offset = -1;
	var best_correlation = 0;
	var rms = 0;
	var foundGoodCorrelation = false;
	var correlations = new Array(MAX_SAMPLES);

	for (var i=0;i<SIZE;i++) {
		var val = buf[i];
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01) // not enough signal
		return -1;

	var lastCorrelation=1;
	for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
		var correlation = 0;

		for (var i=0; i<MAX_SAMPLES; i++) {
			correlation += Math.abs((buf[i])-(buf[i+offset]));
		}
		correlation = 1 - (correlation/MAX_SAMPLES);
		correlations[offset] = correlation; // store it, for the tweaking we need to do below.
		if ((correlation>GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
			foundGoodCorrelation = true;
			if (correlation > best_correlation) {
				best_correlation = correlation;
				best_offset = offset;
			}
		} else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			// Now we need to tweak the offset - by interpolating between the values to the left and right of the
			// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
			// we need to do a curve fit on correlations[] around best_offset in order to better determine precise
			// (anti-aliased) offset.

			// we know best_offset >=1, 
			// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
			// we can't drop into this clause until the following pass (else if).
			var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
			return sampleRate/(best_offset+(8*shift));
		}
		lastCorrelation = correlation;
	}
	if (best_correlation > 0.01) {
		// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
		return sampleRate/best_offset;
	}
	return -1;
//	var best_frequency = sampleRate/best_offset;
}

// Stores the freq of notes in the 4th octave 
let notes_freq_obj = {
	"C" : 261.63, 
	"C#" : 277.18, 
	"D" : 293.66, 
	"D#" : 311.13, 
	"E" : 329.63, 
	"F" : 349.23, 
	"F#" : 369.99, 
	"G" : 392.00, 
	"G#" : 415.30, 
	"A" : 440, 
	"A#" : 466.16, 
	"B" : 493.88
}; 

// Turns on Hue Bulb and changes the color by changing the hue value  
function LightOnHue(satVal, hueVal) {
	let request = new XMLHttpRequest();
	request.open("PUT", url, true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify({"on":true, "sat": satVal, "hue":hueVal}));
}

// Transforms note to within A4 to G4 
//note * Math.pow(2, 4-octave)

// Checks if the user is signing with range
function noteToLightCheck(range1, range2, note_match, note_user, satVal, hueVal) {
	// Gets the value from the HTML button via radio command 
	note_match = document.getElementByName("note"); 

	// Pass through some dictionary 
}


// Updates pitch that it is picking up 
function updatePitch( time ) {
	var cycles = new Array;
	analyser.getFloatTimeDomainData( buf );
	var ac = autoCorrelate( buf, audioContext.sampleRate );

	// This draws the current waveform, useful for debugging
	if (DEBUGCANVAS) {  
		waveCanvas.clearRect(0,0,512,256);
		waveCanvas.strokeStyle = "red";
		waveCanvas.beginPath();
		waveCanvas.moveTo(0,0);
		waveCanvas.lineTo(0,256);
		waveCanvas.moveTo(128,0);
		waveCanvas.lineTo(128,256);
		waveCanvas.moveTo(256,0);
		waveCanvas.lineTo(256,256);
		waveCanvas.moveTo(384,0);
		waveCanvas.lineTo(384,256);
		waveCanvas.moveTo(512,0);
		waveCanvas.lineTo(512,256);
		waveCanvas.stroke();
		waveCanvas.strokeStyle = "black";
		waveCanvas.beginPath();
		waveCanvas.moveTo(0,buf[0]);
		for (var i=1;i<512;i++) {
			waveCanvas.lineTo(i,128+(buf[i]*128));
		}
		waveCanvas.stroke();
	}

	// Checks if any sound input has been given. 
 	if (ac == -1) {
 		detectorElem.className = "vague";
	 	pitchElem.innerText = "--";
		noteElem.innerText = "-";
		detuneElem.className = "";
		detuneAmount.innerText = "--";
 	} else {
	 	detectorElem.className = "confident";
	 	pitch = ac;
	 	pitchElem.innerText = Math.round(pitch) ;
	 	
	 	// Transforms the user's pitch to number within 4th octave freq. range. 
	 	let users_pitch_trans = Math.round(pitch) * Math.pow(2, 4 - octave); 

	 	// Calculates the range of the target note 
		let range1 = note_val - 5;
		let range2 = note_val + 5;

		// Checks if the user is singing on key. Checks by pitch. If within +-5, glow green, else glow red
		if (note_val - 5 < users_pitch_trans && users_pitch_trans < note_val + 5) {
			LightOnHue(satVal, hueVal);
		}

	 	var note = noteFromPitch( pitch );
		noteElem.innerHTML = noteStrings[note%12];
		var detune = centsOffFromPitch( pitch, note );
		if (detune == 0 ) {
			detuneElem.className = "";
			detuneAmount.innerHTML = "--";
		} else {
			if (detune < 0)
				detuneElem.className = "flat";
			else
				detuneElem.className = "sharp";
			detuneAmount.innerHTML = Math.abs( detune );
		}
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	rafID = window.requestAnimationFrame( updatePitch );
}

// Code for Light Bulb, vars defined at top
function bulbOn() {
	request.open("PUT", url, true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify({"on":true}));
}
function bulbOff() {
	request.open("PUT", url, true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify({"on":false}));
}

// 12 functions for turning on the lightbulb to the color of the specified note
// We are aware that it'd be easier if the user typed in a note and we had only one function that inserted
// that note into the dictionary, but we also think that it'd be more fun and user-friendly if the user could
// click on lots of different buttons and change the light bulbs colors quickly.

// Only one function because getting value
function noteC() {
	LightOnHue();
}
function noteCSharp() {
	request.send(JSON.stringify({"xy":notes_to_color['C#']}));
}
function noteD() {
	request.send(JSON.stringify({"xy":notes_to_color['D']}));
}
function noteDSharp() {
	request.send(JSON.stringify({"xy":notes_to_color['D#']}));
}
function noteE() {
	request.send(JSON.stringify({"xy":notes_to_color['E']}));
}
function noteF() {
	request.send(JSON.stringify({"xy":notes_to_color['F']}));
}
function noteFSharp() {
	request.send(JSON.stringify({"xy":notes_to_color['F#']}));
}
function noteG() {
	request.send(JSON.stringify({"xy":notes_to_color['G']}));
}
function noteGSharp() {
	request.send(JSON.stringify({"xy":notes_to_color['G#']}));
}
function noteA() {
	request.send(JSON.stringify({"xy":notes_to_color['A']}));
}
function noteASharp() {
	request.send(JSON.stringify({"xy":notes_to_color['A#']}));
}
function noteB() {
	request.send(JSON.stringify({"xy":notes_to_color['B']}));
}


// switch (calc_pitch) {
		// 	case (261.63 - 5 < calc_pitch && calc_pitch < 261.63 + 5): 
		// 		LightOnHue(1000)
		// 		console.log('C4')
		// 		// break;
			case (277.18 - 5 < calc_pitch && calc_pitch < 277.18 + 5):
				LightOnHue(35000)
				console.log('C#4')
				// break;
		// 	case (293.66 - 5 < calc_pitch && calc_pitch < 293.66 + 5):
		// 		// request.send(JSON.stringify({"hue":35000}));
		// 		console.log('D4')
		// 		// break;
		// 	case (311.13):
		// 		// request.send(JSON.stringify({"hue":35000}));
		// 		console.log('D#4')
		// 		// break;
		// 	case 329.63:
		// 		// request.send(JSON.stringify({"hue":35000}));
		// 		console.log('E4')
		// 		// break;
		// 	case 349.23:
		// 		// request.send(JSON.stringify({"hue":35000}));
		// 		console.log('F4')
		// 		// break;
		// 	case 369.99:
		// 		// request.send(JSON.stringify({"hue":35000}));
		// 		console.log('F#4')
		// 		// break;
		// 	case 392.00:
		// 		// request.send(JSON.stringify({"hue":35000}));
		// 		console.log('G4')
		// 		// break;
		// 	case 415.30:
		// 		// request.send(JSON.stringify({"hue":35000}));
		// 		console.log('G#4')
		// 		// break;
		// 	case 440.00:
		// 		LightOnHue(25500)
		// 		console.log('A4')
		// 		// break;
		// 	case 466.16:
		// 		LightOnHue(65500)
		// 		console.log('A#4')
		// 		// break;
		// 	case 493.88:
		// 		LightOnHue(65500)
		// 		console.log('B4')
		// 		// break;
		// 	}