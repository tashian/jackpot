// Chrome automatically creates a background.html page for this to execute.
// notify of page refreshes
// Background page -- background.js

var bass = new Wad({
    source : 'sine',
    env : {
        attack : .02,
        decay : .1,
        sustain : .9,
        hold : .4,
        release : .1
    },
    loop: true
});

function newBass(iteration, label) {
  var notes = ['C3','E3','G3','B3','D4','F#4','A4'];
  var currentNote = iteration % notes.length;
  bass.play({ pitch : notes[currentNote], label: label });
}

function muteUnmute() {
  console.log(bass.volume);
  if (bass.volume > 0) {
    console.log('muted');
    bass.setVolume(0);
  } else {
    console.log('unmuted');
    bass.setVolume(initialVol);
  }
}

function resetAll() {
  console.log('reset');
  requestCount = 0;
  for (var i = 0; i < oscs.length; i++) {
    bass.stop(oscs[i]);
  }
  oscs = [];
}

chrome.runtime.onConnect.addListener(function(popupConnection) {
  console.log("connection established from popup.js");

  var popupCommandListener = function(msg) {
    console.log(msg);
    if (msg.type == 'mute') {
      muteUnmute();
    } else {
      resetAll();
    }
  };

  popupConnection.onMessage.addListener(popupCommandListener);

  popupConnection.onDisconnect.addListener(function() {
       popupConnection.onMessage.removeListener(popupCommandListener);
  });

});

var requestCount = 0;
var oscs = [];
var addAndPlay = function(details) {
  if (!oscs.includes(details.requestId)) {
    newBass(requestCount, details.requestId);
    oscs.push(details.requestId);
    requestCount++;
  }
}

var stopPlaying = function(details) {
  bass.stop(details.requestId);
}

chrome.tabs.onUpdated.addListener(function(tabId , info) {
    if (info.status == "complete") {
      resetAll();
    }
});

chrome.webRequest.onSendHeaders.addListener(
  addAndPlay,
  { urls: [
    "http://*/*",
    "https://*/*"
  ] }
);

chrome.webRequest.onErrorOccurred.addListener(
  stopPlaying,
  { urls: [
    "http://*/*",
    "https://*/*"
  ] }
);

chrome.webRequest.onCompleted.addListener(
  stopPlaying,
  { urls: [
    "http://*/*",
    "https://*/*"
  ] }
);
