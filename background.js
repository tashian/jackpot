// Chrome automatically creates a background.html page for this to execute.
// notify of page refreshes
// Background page -- background.js
// "Listening to events"
// Ambient backdrop to software dev
// Office space sound -- code checked in today
// DevOps sound
// images and sound vs. js vs. css
// XSS (how much is this site tracking me?)

sound = new function() {
  var tones = {
    bass: new Wad({
            source : 'sine',
            env : {
                attack : .02,
                decay : .1,
                sustain : .9,
                // hold : .4,
                release : .1
            }
        }),
    edgy: new Wad({
            source : 'square',
            volume: 0.1,
            env : {
                attack : .02,
                decay : .1,
                sustain : .9,
                hold : .2,
                release : .1
            }
        })
  }

  var currentlyPlaying = {};
  var notes = ['C3','E3','G3','B3','D4','F#4','A4'];

  this.muted = false;

  this.isPlaying = function(label) {
    if (currentlyPlaying.hasOwnProperty(label)) { return true; }
    return false;
  }

  this.canPlay = function(label) {
    if (this.isPlaying(label)) { return false; }
    if (this.muted) { return false; }
    return true;
  }

  this.playLongNote = function(toneName, label) {
    if (!this.canPlay(label)) { return; }
    var currentNote = Object.keys(currentlyPlaying).length % notes.length;
    currentlyPlaying[label] = toneName;
    tones[toneName].play({ pitch : notes[currentNote], label: label });
  }

  this.play = this.playLongNote;

  this.playShortNote = function(toneName, label) {
    if (!this.canPlay(label)) { return; }
    tones[toneName].play({pitch: notes[0], label: label});
  }

  this.stop = function(label) {
    if (!this.isPlaying(label)) { return; }
    tones[currentlyPlaying[label]].stop(label);
    delete currentlyPlaying[label];
  }

  this.stopAll = function() {
    console.log('reset');
    for (var i = 0; i < currentlyPlaying.length; i++) {
      this.stop(currentlyPlaying[i]);
    }
  }

  this.muteUnmute = function() {
    this.stopAll();
    this.muted = !this.muted;
  }
}

chrome.runtime.onConnect.addListener(function(popupConnection) {
  console.log("connection established from popup.js");

  var popupCommandListener = function(msg) {
    console.log(msg);
    if (msg.type == 'mute') {
      sound.muteUnmute();
    } else {
      sound.stopAll();
    }
  };

  popupConnection.onMessage.addListener(popupCommandListener);

  popupConnection.onDisconnect.addListener(function() {
       popupConnection.onMessage.removeListener(popupCommandListener);
  });

});

chrome.webRequest.onSendHeaders.addListener(
  function(details) {
    sound.play('bass', details.requestId);
  },
  { urls: [
    "http://*/*",
    "https://*/*"
  ] }
);

chrome.webRequest.onErrorOccurred.addListener(
  function(details) {
    console.log('error');
    console.log(details);
    sound.stop(details.requestId);
    sound.playShortNote('edgy', details.requestId);
  },
  { urls: [
    "http://*/*",
    "https://*/*"
  ] }
);

chrome.webRequest.onCompleted.addListener(
  function(details) {
    sound.stop(details.requestId);
  },
  { urls: [
    "http://*/*",
    "https://*/*"
  ] }
);
