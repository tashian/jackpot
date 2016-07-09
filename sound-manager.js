SoundManager = new function() {
  this.dispatch = function(eventName, info) {
    console.log('event ' + eventName);
    this[eventName](info);
  }

  this.responseStarted = function(info) {
    var bytesPerMegabyte = 1048576;
    if (info.fromCache) { return; }
    if (info.statusCode != 200 && info.statusCode != 304 && info.statusCode != 204) {
      console.log('status ' + info.statusCode)
    }
    sound.play('bass', info.requestId, 0.2);
  }

  this.error = function(info) {
    if (info.error == 'net::ERR_BLOCKED_BY_CLIENT' ||
        info.error == 'net::ERR_ABORTED') { return; }
    console.log('error ' + info.error);
    sound.play('edgy', info.requestId, 0.2);
    sound.stop(info.requestId);
  }

  this.loading = function(info) {
    sound.reset();
  }

  this.complete = function(info) {
  }
}
