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
  // Event listeners
  //
  function objectifyResponseHeaders(arrayedHeaders) {
    return _.reduce(arrayedHeaders, function(result, header) {
      result[header.name.toLowerCase()] = header.value;
      return result;
    }, {});
  }

  function requestListener(cb) {
    return function(info) {
      if (!TabController.tabIsAllowedToPlay(info.tabId)) { return; }
      tabController = TabController.get(info.tabId);
      cb(info, tabController);
    }
  }

  chrome.webRequest.onResponseStarted.addListener(
    requestListener(function(info, tabController) {
      var headers = objectifyResponseHeaders(info.responseHeaders);

      chrome.tabs.get(info.tabId, function(tab) {
        if (chrome.runtime.lastError) {
          console.log('Error: ' + chrome.runtime.lastError.message);
          return;
        }
        if (typeof tab == 'undefined') {
          // This usually means something is being typed in the browser bar
          return;
        }

        tabController.dispatch('responseStarted', {
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
    }),
    allUrlsFilter,
    ["responseHeaders"]
  );

  chrome.tabs.onUpdated.addListener(function(tabId, info) {
    if (MuteButtonListener.isMuted()) { return; }
    if (info.status == 'loading' || info.status == 'complete') {
      TabController.get(tabId).dispatch(info.status, {
        url: info.url
      });
    }
  });
})();
