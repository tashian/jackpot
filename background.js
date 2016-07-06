// Chrome automatically creates a background.html page for this to execute.
// notify of page refreshes
// Background page -- background.js
// "Listening to events"
// Ambient backdrop to software dev
// Office space sound -- code checked in today
// DevOps sound
// images and sound vs. js vs. css
// XSS (how much is this site tracking me?)

chrome.runtime.onConnect.addListener(function(popupConnection) {
  var popupCommandListener = function(msg) {
    console.log(msg);
    if (msg.type == 'mute') {
      sound.muteUnmute();
    } else {
      sound.stopAll();
    }
  };

  popupConnection.onMessage.addListener(popupCommandListener);

  popupConnection.onDisconnect.addListener(function() {
       popupConnection.onMessage.removeListener(popupCommandListener);
  });

});

chrome.webRequest.onResponseStarted.addListener(
  function(details) {
    var bytesPerMegabyte = 1048576;
    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name.toLowerCase() === 'content-length') {
        var bytes = details.responseHeaders[i].value;
        sound.play('bass', details.requestId, bytes / bytesPerMegabyte);
      }
    }
  },
  { urls: ["<all_urls>"]
  },
  ["responseHeaders"]
);

chrome.webRequest.onErrorOccurred.addListener(
  function(details) {
    if (details.error == 'net::ERR_BLOCKED_BY_CLIENT' ||
        details.error == 'net::ERR_ABORTED') { return; }
    console.log('error ' + details.error);
    sound.stop(details.requestId);
    sound.play('edgy', details.requestId, 0.2);
  },
  { urls: ["<all_urls>"] }
);

chrome.tabs.onUpdated.addListener(function(tabId , info) {
  console.log(info);
  if (info.status == 'loading') {
    sound.reset();
  }
  // if (info.status == 'complete') {
  //   sound.play('done', 0.2)
  // }
});
