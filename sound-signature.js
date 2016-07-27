SoundSignature = function() {
  var tones = {
    coinslot: new Wad({source: chrome.extension.getURL('wav/coinslot.wav')}),
    complete: new Wad({source: chrome.extension.getURL('wav/cash-register.wav')}),
    powerup: new Wad({source: chrome.extension.getURL('wav/powerup.wav')})
  };

  var coinDrops = [
    new Wad({source: chrome.extension.getURL('wav/jackpot1.wav')}),
    new Wad({source: chrome.extension.getURL('wav/jackpot2.wav')}),
    new Wad({source: chrome.extension.getURL('wav/jackpot3.wav')}),
    new Wad({source: chrome.extension.getURL('wav/jackpot4.wav')}),
    new Wad({source: chrome.extension.getURL('wav/jackpot5.wav')})
  ]

  var lastPlay = Date.now() - 1000;
  this.play = function() {
    if (Date.now() - lastPlay > 100) {
      getNextTrackerTone('tracker').play({
        volume: 0.8
      });
      lastPlay = Date.now();
    }
  }

  var lastCompleted = Date.now() - 2000;
  this.complete = function() {
    if (Date.now() - lastCompleted >= 2000) {
      tones['complete'].play({ volume: 0.8 });
      lastCompleted = Date.now();
    }
  }

  var currentTrackerNote = 0;
  function getNextTrackerTone() {
    if ((++currentTrackerNote % 15) == 0) {
      return tones['powerup'];
    } else {
      return coinDrops[Math.floor(Math.random() * coinDrops.length)];
    }
  }

  this.reset = function() {
    lastPlay = Date.now() - 1000;
    currentNote = 0;
    currentTrackerNote = 0;

    // aaannd play the first note to kick things off.
    tones['coinslot'].play();
  }


}
