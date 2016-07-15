// Chrome automatically creates a background.html page for this to execute.
// notify of page refreshes
// Background page -- background.js
// "Listening to events"
// Ambient backdrop to software dev
// Office space sound -- code checked in today
// DevOps sound
// images and sound vs. js vs. css
// XSS (how much is this site tracking me?)

(function() {
  var allUrlsFilter = { urls: ["<all_urls>"] };

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
    function(info) {
      if (info.tabId < 0) { return; }
      
      function objectifyResponseHeaders(arrayedHeaders) {
        return _.reduce(arrayedHeaders, function(result, header) {
          result[header.name.toLowerCase()] = header.value;
          return result;
        }, {});
      }

      var headers = objectifyResponseHeaders(info.responseHeaders);

      chrome.tabs.get(info.tabId, function(tab) {
        SoundManager.dispatch('responseStarted', {
          tabId: info.tabId,
          requestId: info.requestId,
          timestamp: info.timestamp,
          fileType: info.type,
          lastModified: headers['last-modified'],
          contentLength: headers['content-length'],
          statusCode: info.statusCode,
          fromCache: info.fromCache,
          // isSsl: info.scheme,
          pageUrl: tab.url,
          url: info.url
        });
      });
    },
    allUrlsFilter,
    ["responseHeaders"]
  );

  chrome.webRequest.onErrorOccurred.addListener(
    function(info) {
      SoundManager.dispatch('error', {
        tabId: info.tabId,
        requestId: info.requestId,
        error: info.error,
        statusCode: info.statusCode,
        fromCache: info.fromCache,
        // isSsl: info.scheme,
        fileType: info.fileType,
        url: info.url
      })
    },
    allUrlsFilter
  );

  chrome.tabs.onUpdated.addListener(function(tabId, info) {
    if (info.status == 'loading' || info.status == 'complete') {
      SoundManager.dispatch(info.status, {
        tabId: tabId,
        // isSsl: info.scheme,
        url: info.url
      });
    }
  });
})();
