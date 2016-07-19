
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

  var notes = ['B2','D3','F#3','A3',
               'C3','E3','G3','B3','D4','F#4','A4',
               'C4','E4','G4','B4','D5','F#5','A5'];
  var plays = {};

  this.muted = false;

  function isPlaying(label) {
    if (currentlyPlaying.hasOwnProperty(label)) { return true; }
    return false;
  }

  function canPlay(label) {
    if (this.muted) { return false; }
    return true;
  }

  this.play = function(toneName, label, variety, length) {
    console.log('play ' + length);
    if (!canPlay(label)) { return; }
    tones[toneName].play({ pitch : notes[this.nextNote(variety)], label: label, env: {hold: length} });
  }

  this.nextNote = function(label) {
    if (!plays.hasOwnProperty(label)) {
      plays[label] = 0;
    }
    return plays[label]++ % notes.length;
  }

  this.reset = function(label) {
    plays = {};
  }

  this.muteUnmute = function() {
    this.muted = !this.muted;
  }

  this.stats = function() {
    return {
      plays: plays
    }
  }
}
