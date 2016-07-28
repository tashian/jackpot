var SoundManager = function(tabId) {
  var signature = new SoundSignature();

  this.dispatch = function(eventName, info) {
    console.log('[' + info.requestId + '] event ' + eventName);
    this[eventName](info);
  }

  this.responseStarted = function(info) {
    if (info.statusCode != 200 && info.statusCode != 304 && info.statusCode != 204) {
      console.log('status ' + info.statusCode)
    }
    var tracker = TrackerChecker.lookup(info.pageUrl, info.url)
    if (trackerIsPlayable(tracker)) {
      signature.play();
    }
  }

  function trackerIsPlayable(tracker) {
    return (typeof tracker != 'undefined' && tracker.category != 'Content');
  }

  this.complete = function(info) {
    signature.complete();
  }

  this.loading = function(info) {
    signature.reset();
  }

}
