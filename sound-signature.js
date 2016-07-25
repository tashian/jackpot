SoundSignature = function() {
  var tones = {
    coinslot: new Wad({source: chrome.extension.getURL('wav/coinslot.wav')}),
    request: new Wad({
                source : 'sine',
                volume: 0.1,
                env : {
                    attack : .02,
                    decay : .1,
                    hold: 0.1,
                    sustain : .9,
                    release : .1
                }
             }),
    tracker: new Wad(Wad.presets.piano),
    ad: new Wad({source: chrome.extension.getURL('wav/cash-register2.mp3')}),
    error: new Wad({
            source : 'square',
            volume: 0.1,
            env : {
              attack : .02,
              decay : .1,
              sustain : .9,
              hold : 1,
              release : .1
            }
          }),
    powerup: new Wad({source: chrome.extension.getURL('wav/powerup.wav')})
  };

  var typewriterKeys = [
    new Wad({source: chrome.extension.getURL('wav/jackpot1.wav')}),
    new Wad({source: chrome.extension.getURL('wav/jackpot2.wav')}),
    new Wad({source: chrome.extension.getURL('wav/jackpot3.wav')}),
    new Wad({source: chrome.extension.getURL('wav/jackpot4.wav')}),
    new Wad({source: chrome.extension.getURL('wav/jackpot5.wav')})
  ]

  var returnKey = new Wad(
    {source: chrome.extension.getURL('wav/returnkey.wav')}
  );

  var notes = ['E1','G#1','C#2','F#2','B3',
               'E3','G#3','C#4','F#4','B5',
               'E5'];

  var lastPlay = Date.now() - 1000;

  this.play = function(uid, toneType, timeStamp, length, tracker) {
    var pitch;
    console.log(tracker);
    if (tracker.category == 'Content') { return; }
    // if (tracker.category == 'Advertising') {
    //   toneType = 'ad';
    // }
    if (!(toneType in tones)) { reject('Tone ' + toneType + ' not found.'); }
    if (Date.now() - lastPlay > 100) {
      getNextTone(toneType).play({
        length: length,
        pitch: pitch,
        // startTime: timeStamp,
        // fileType: fileType,
        // env: {hold: 0.1},
        label: uid,
        volume: 0.5
        // wait: attackScaler(note.startTime)
      });
      lastPlay = Date.now();
    }
  }

  // function pitchFromFileType(fileType) {
  //   if (fileType == 'image') {
  //     return notes[10];
  //   } else if (fileType == 'main_frame') {
  //     return notes[3];
  //   } else if (fileType == 'stylesheet') {
  //     return notes[6];
  //   } else if (fileType == 'script') {
  //     return notes[9];
  //   } else if (fileType == 'xmlhttprequest') {
  //     return notes[12];
  //   } else if (fileType == 'font') {
  //     return notes[13];
  //   } else if (fileType == 'sub_frame') {
  //     return notes[1];
  //   }
  //   return notes[2];
  // }

  var currentTrackerNote = 0;
  function getNextTone(toneType) {
    if (toneType == 'tracker') {
      if ((++currentTrackerNote % 15) == 0) {
        console.log('[tone][' + currentTrackerNote + '] return');
        return tones['powerup'];
      } else {
        console.log('[tone][' + currentNote + '] ' + toneType);
        return typewriterKeys[Math.floor(Math.random()*typewriterKeys.length)];
      }
    } else {
      return tones[toneType];
    }
  }

  var currentNote = 0;
  function getNextPitch() {
    return notes[currentNote++ % notes.length];
  }

  this.reset = function() {
    lastPlay = Date.now() - 1000;
    currentNote = 0;
    currentTrackerNote = 0;

    // aaannd play the first note to kick things off.
    tones['coinslot'].play();
  }


}
