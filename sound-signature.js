SoundSignature = function() {
  var tones = {
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
    tracker: new Wad({
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

  this.push = function(uid, toneType, timeStamp, length) {
    promise = function(resolve, reject) {
      if (!(toneType in tones)) { reject('Tone ' + toneType + ' not found.'); }
      resolve([uid, {
        tone: tones[toneType],
        startTime: timeStamp,
        // length: length,
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
    var scaledMax = 0.8;
    var scaledMin = 0.1;
    return ((scaledMax-scaledMin)*(x-min))/(max-min);
  }

  var scale = _.curry(_scale);

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

      var i = 0;
      _.forEach(validNotes, function(note, uid) {
        playNote(note, uid, notes[i++ % notes.length], attackScaler, lengthScaler);
      });
    });
  }

  function scaleMaxMin(notes, flatMapIteratee) {
    var timings = _.flatMap(
      notes,
      flatMapIteratee
    );
    return scale(_.min(timings), _.max(timings));
  }

  function playNote(note, uid, pitch, attackScaler, lengthScaler) {
    note.tone.play(
      _(note)
      .merge(
        { pitch: pitch,
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

}
