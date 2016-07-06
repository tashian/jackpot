
sound = new function() {
  var tones = {
    bass: new Wad({
            source : 'sine',
            volume: 0.1,
            env : {
                attack : .02,
                decay : .1,
                sustain : .9,
                release : .1
            },
            vibrato : { // A vibrating pitch effect.  Only works for oscillators.
              shape     : 'sine', // shape of the lfo waveform. Possible values are 'sine', 'sawtooth', 'square', and 'triangle'.
              magnitude : 9,      // how much the pitch changes. Sensible values are from 1 to 10.
              speed     : 5,      // How quickly the pitch changes, in cycles per second.  Sensible values are from 0.1 to 10.
              attack    : 3       // Time in seconds for the vibrato effect to reach peak magnitude.
           }
        }),
    edgy: new Wad({
            source : 'square',
            volume: 0.1,
            env : {
              attack : .02,
              decay : .1,
              sustain : .9,
              hold : 1,
              release : .1
            }
        })
  }

  var currentlyPlaying = {};
  var notes = ['C2','E2','G2','B2','D3','F#3','A3',
               'C3','E3','G3','B3','D4','F#4','A4',
               'C4','E4','G4','B4','D5','F#5','A5'];
  var plays = 0;

  this.muted = false;

  function isPlaying(label) {
    if (currentlyPlaying.hasOwnProperty(label)) { return true; }
    return false;
  }

  function canPlay(label) {
    if (isPlaying(label)) { return false; }
    if (this.muted) { return false; }
    return true;
  }

  this.play = function(toneName, label, length) {
    var length = typeof length !== 'undefined' ? length : 10;

    console.log('playLong ' + length);
    if (!canPlay(label)) { return; }
    currentlyPlaying[label] = toneName;
    tones[toneName].play({ pitch : notes[this.nextNote()], label: label, env: {hold: length} });
    setTimeout(function() {
      delete currentlyPlaying[label];
    }, length * 1000);
  }

  this.nextNote = function() {
    return plays++ % notes.length;
  }

  this.stop = function(label) {
    if (!isPlaying(label)) { return; }
    tones[currentlyPlaying[label]].stop(label);
    delete currentlyPlaying[label];
  }

  this.stopAll = function() {
    for (var i = 0; i < currentlyPlaying.length; i++) {
      this.stop(currentlyPlaying[i]);
    }
  }

  this.reset = function(label) {
    plays = 0;
    currentlyPlaying = {};
  }

  this.muteUnmute = function() {
    this.stopAll();
    this.muted = !this.muted;
  }

  this.stats = function() {
    return {
      currentlyPlaying: Object.keys(currentlyPlaying).length,
      plays: plays
    }
  }
}
