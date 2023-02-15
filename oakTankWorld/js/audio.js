//written by Slobodan Zivkovic slobacartoonac@gmail.com
"use strict";
export var myAudio = function () { };
myAudio.init = function () {
	if (typeof AudioContext !== "undefined") {
		myAudio.context = new AudioContext();
	} else if (typeof webkitAudioContext !== "undefined") {
		myAudio.context = new webkitAudioContext();
	} else {
		throw new Error('AudioContext not supported. :(');
	}
	myAudio.svolume = myAudio.context.createGain();
	myAudio.svolume.connect(myAudio.context.destination);
	myAudio.svolume.gain.value = 0.9;
	myAudio.loaded = {};
	myAudio.buffers = {};
}

myAudio.requestSound = function (sid, sname) {
	var request = new XMLHttpRequest();
	request.open("GET", sname, true);
	request.responseType = "arraybuffer";

	request.onload = function () {
		var audioData = request.response;
		myAudio.createSoundSource(audioData, sname, sid);
	};
	request.send();
	return { play: function () { myAudio.playSound(sid); } };
}
myAudio.finishedLoading = function (bufferList) {
	myAudio.loaded = bufferList;
}

myAudio.playSound = function (name, volume) {
	if (!myAudio.loaded[name]) return;
	var vol = myAudio.context.createGain();
	vol.gain.value = volume;
	vol.connect(myAudio.svolume);
	var soundSource = myAudio.context.createBufferSource();
	soundSource.buffer = myAudio.loaded[name];
	soundSource.connect(vol);
	soundSource.start(myAudio.context.currentTime);
	var ret = { s: soundSource, v: vol, end: false };
	soundSource.onended = function () { ret.end = true };
	return ret;
}

myAudio.createSoundSource = function (audioData, nameData, sid) {

	myAudio.context.decodeAudioData(audioData, function (soundBuffer) {
		myAudio.loaded[sid] = soundBuffer;
	});
}