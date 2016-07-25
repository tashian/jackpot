SoundManager = function(tabId) {
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
    if (typeof tracker != 'undefined') {
      signature.play(info.requestId, 'tracker', info.timeStamp, info.contentLength, tracker);
    }
  }

  this.requestCompleted = function(info) {
  }

  this.complete = function(info) {
    signature.play(info.requestId, 'complete', info.timeStamp);
  }

  this.error = function(info) {
    if (info.error == 'net::ERR_BLOCKED_BY_CLIENT' ||
        info.error == 'net::ERR_ABORTED') { return; }
    console.log('error ' + info.error);
    sound.play(info.requestId, 'error', info.timeStamp, 100);
  }

  this.loading = function(info) {
    signature.reset();
  }

}
