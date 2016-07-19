SoundManager = new function() {
  this.dispatch = function(eventName, info) {
    console.log('event ' + eventName);
    this[eventName](info);
  }

  this.noteLengthFromContentLength = function(contentLength) {
    var bytesPerMegabyte = 1048576;
    if (isNaN(contentLength)) {
      contentLength = 1;
    }
    return Math.min(0.1, contentLength / bytesPerMegabyte);
  }

  this.responseStarted = function(info) {
    if (info.fromCache) { return; }
    if (info.statusCode != 200 && info.statusCode != 304 && info.statusCode != 204) {
      console.log('status ' + info.statusCode)
    }
    if (TrackerChecker.isTrackingRequest(info.pageUrl, info.url)) {
      sound.play('edgy', info.requestId, 'tracker', this.noteLengthFromContentLength(info.contentLength));
    } else {
      sound.play('bass', info.requestId, 'plain', this.noteLengthFromContentLength(info.contentLength));
    }
  }

  this.error = function(info) {
    if (info.error == 'net::ERR_BLOCKED_BY_CLIENT' ||
        info.error == 'net::ERR_ABORTED') { return; }
    console.log('error ' + info.error);
    sound.play('edgy', info.requestId, 'error', 0.2);
  }

  this.loading = function(info) {
    sound.reset();
  }

  this.complete = function(info) {
  }
}
