SoundManager = function(tabId) {
  var signature = new SoundSignature();

  this.dispatch = function(eventName, info) {
    console.log('[' + info.requestId + '] event ' + eventName);
    this[eventName](info);
  }

  this.responseStarted = function(info) {
    if (info.fromCache) { return; }
    if (info.statusCode != 200 && info.statusCode != 304 && info.statusCode != 204) {
      console.log('status ' + info.statusCode)
    }
    if (TrackerChecker.isTrackingRequest(info.pageUrl, info.url)) {
      signature.push(info.requestId, 'tracker', info.timeStamp, info.contentLength);
    } else {
      signature.push(info.requestId, 'request', info.timeStamp, info.contentLength);
    }
  }

  this.requestCompleted = function(info) {
    signature.finish(info.requestId, info.timeStamp);
  }

  this.error = function(info) {
    if (info.error == 'net::ERR_BLOCKED_BY_CLIENT' ||
        info.error == 'net::ERR_ABORTED') { return; }
    console.log('error ' + info.error);
    sound.push(info.requestId, 'error', info.timeStamp, 0.2);
  }

  this.loading = function(info) {
    signature = new SoundSignature();
  }

  this.complete = function(info) {
    signature.play();
  }
}
