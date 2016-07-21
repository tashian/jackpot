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

  //
  // Connection to the extension's popup menu
  //
  chrome.runtime.onConnect.addListener(function(popupConnection) {
    var popupCommandListener = function(msg) {
      console.log(msg);
      if (msg.type == 'mute') {
        // ?
      } else {
        // ??
      }
    };

    popupConnection.onMessage.addListener(popupCommandListener);

    popupConnection.onDisconnect.addListener(function() {
         popupConnection.onMessage.removeListener(popupCommandListener);
    });

  });

  //
  // Event listeners
  //
  chrome.webRequest.onResponseStarted.addListener(
    function(info) {
      if (!TabController.tabIsAllowedToPlay(info.tabId)) { return; }

      function objectifyResponseHeaders(arrayedHeaders) {
        return _.reduce(arrayedHeaders, function(result, header) {
          result[header.name.toLowerCase()] = header.value;
          return result;
        }, {});
      }

      var headers = objectifyResponseHeaders(info.responseHeaders);

      chrome.tabs.get(info.tabId, function(tab) {
        if (typeof tab == 'undefined') {
          // This usually means something is being typed in the browser bar
          TabController.get(info.tabId).dispatch('loading');
          return;
        }

        TabController.get(info.tabId).dispatch('responseStarted', {
          requestId: info.requestId,
          timeStamp: info.timeStamp,
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

  chrome.webRequest.onCompleted.addListener(
    function(info) {
      if (!TabController.tabIsAllowedToPlay(info.tabId)) { return; }
      TabController.get(info.tabId).dispatch('requestCompleted', {
        requestId: info.requestId,
        timeStamp: info.timeStamp,
        url: info.url
      });
    },
    allUrlsFilter
  );

  chrome.webRequest.onErrorOccurred.addListener(
    function(info) {
      if (!TabController.tabIsAllowedToPlay(info.tabId)) { return; }

      TabController.get(info.tabId).dispatch('error', {
        requestId: info.requestId,
        timeStamp: info.timeStamp,
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
      TabController.get(tabId).dispatch(info.status, {
        url: info.url
      });
    }
  });

  //
  // Tab Management
  //

  TabController = new function() {
    var soundManagers = {};

    this.get = function(tabId) {
      if (!(tabId in soundManagers)) {
        tabWasCreated(tabId);
      }
      return soundManagers[tabId];
    }

    this.tabIsAllowedToPlay = function(tabId) {
      if (tabId == chrome.tabs.TAB_ID_NONE) { return false; }
      return true;
    }

    function tabWasCreated(tabId) {
      soundManagers[tabId] = new SoundManager();
    }

    function tabWasRemoved(tabId) {
      if (tabId in soundManagers) {
        // soundManagers[tabId].finish();
        delete soundManagers[tabId];
      }
    }

    function tabWasReplaced(addedTabId, removedTabId) {
      if (removedTabId in soundManagers) {
        soundManagers[addedTabId] = soundManagers[removedTabId];
        delete soundManagers[removedTabId];
      }
    }

    chrome.tabs.onCreated.addListener(tabWasCreated);
    chrome.tabs.onRemoved.addListener(tabWasRemoved);
    chrome.tabs.onReplaced.addListener(tabWasReplaced);
  };
})();
