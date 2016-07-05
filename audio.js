// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
// https://developer.chrome.com/extensions/devtools

var semitoneCents = 100;

var bass = new Wad({
    source : 'sine',
    env : {
        attack : .02,
        decay : .1,
        sustain : .9,
        hold : .4,
        release : .1
    }
});

function newBass(iteration, label) {
  bass.play({ pitch : 'C2', label: label, detune: semitoneCents * iteration });
}

document.querySelector("#mute").addEventListener('click', function() {
  if (bass.volume > 0) {
    bass.setVolume(0);
  } else {
    bass.setVolume(initialVol);
  }
});

document.querySelector("#reset").addEventListener('click', resetAll);

function resetAll() {
  requestCount = 0;
  for (var i = 0; i < oscs.length; i++) {
    console.log('stopped ' + oscs[i]);
    bass.stop(oscs[i]);
  }
  oscs = [];
}

var port = chrome.runtime.connect({name: "sonic-devtools"});

var requestCount = 0;
var oscs = [];
port.onMessage.addListener(function(msg) {
  console.log(msg.type, msg.details.requestId);
  if (msg.type == 'beforeRequest') {
    if (!oscs.includes(msg.details.requestId)) {
      newBass(requestCount, msg.details.requestId);
      oscs.push(msg.details.requestId);
      requestCount++;
    }
  } else if (msg.type == 'completed') {
    bass.stop(msg.details.requestId);
  } else {
    resetAll();
  }
});
