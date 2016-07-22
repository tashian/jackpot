SoundSignature = function() {
  var tones = {
    start: new Wad({
                source : 'sine',
                volume: 0.1,
                env : {
                    attack : .02,
                    decay : .1,
                    hold: .1,
                    sustain : .1,
                    release : .1
                }
             }),
    request: new Wad({
                source : 'sine',
                volume: 0.1,
                env : {
                    attack : .02,
                    decay : .1,
                    sustain : .9,
                    release : .1
                }
             }),
    tracker: new Wad(Wad.presets.piano),
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
          })
  };

  var notes = ['B2','D3','F#3','A3',
               'C3','E3','G3','B3','D4','F#4','A4',
               'C4','E4','G4','B4','D5','F#5','A5'];
  var promises = [];

  this.push = function(uid, toneType, timeStamp, fileType) {
    promise = function(resolve, reject) {
      if (!(toneType in tones)) { reject('Tone ' + toneType + ' not found.'); }
      resolve([uid, {
        tone: tones[toneType],
        startTime: timeStamp,
        fileType: fileType,
        label: uid
      }]);
    }
    promises.push(new Promise(promise));
  }

  this.finish = function(uid, timeStamp) {
    promise = function(resolve, reject) {
      resolve([uid, {
        endTime: timeStamp,
        label: uid }
      ]);
    }
    promises.push(new Promise(promise));
  }

  function _scale(min, max, x) {
    // via http://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
    var scaledMax = 2;
    var scaledMin = 0.1;
    return ((scaledMax-scaledMin)*(x-min))/(max-min);
  }

  var scale = _.curry(_scale);

  function scaleMaxMin(notes, flatMapIteratee) {
    var timings = _.flatMap(
      notes,
      flatMapIteratee
    );
    return scale(_.min(timings), _.max(timings));
  }

  this.play = function() {
    Promise.all(promises).then(function (values) {
      validNotes = _.chain(values).
        reduce(function(result, value) {
          _.merge(
            (result[value[0]] || (result[value[0]] = {})),
            value[1]
          );
          return result;
        }, {}).
        filter(function(note) {
          if (note.hasOwnProperty('startTime') && note.hasOwnProperty('endTime')) {
            return true;
          } else {
            return false;
          }
        }).
        value();

      console.log('playing ' + Object.keys(validNotes).length + ' notes.')

      var lengthScaler = scaleMaxMin(
        validNotes,
        function(n) { return n.endTime - n.startTime; }
      );
      var attackScaler = scaleMaxMin(
        validNotes,
        function(n) { return n.startTime; }
      );

      _.forEach(validNotes, function(note, uid) {
        playNote(note, uid, validNotes.length, attackScaler, lengthScaler);
      });
    });
  }

  function pitchFromFileType(fileType) {
    if (fileType == 'image') {
      return notes[10];
    } else if (fileType == 'main_frame') {
      return notes[3];
    } else if (fileType == 'stylesheet') {
      return notes[6];
    } else if (fileType == 'script') {
      return notes[9];
    } else if (fileType == 'xmlhttprequest') {
      return notes[12];
    } else if (fileType == 'font') {
      return notes[13];
    } else if (fileType == 'sub_frame') {
      return notes[1];
    }
    return notes[2];
  }

  function playNote(note, uid, totalNotes, attackScaler, lengthScaler) {
    note.tone.play(
      _(note)
      .merge(
        { volume: 1.5 / totalNotes,
          pitch: pitchFromFileType(note.fileType),
          env: {
            hold: lengthScaler(note.endTime - note.startTime)
          },
          wait: attackScaler(note.startTime)
        }
      )
      // .tap(function(n) { console.log(n); })
      .value()
    );
  }

  // aaannd play the first note to kick things off.
  tones['start'].play();
}
