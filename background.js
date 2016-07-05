// Chrome automatically creates a background.html page for this to execute.
// notify of page refreshes
// Background page -- background.js

chrome.runtime.onConnect.addListener(function(devToolsConnection) {
  console.log("connection established from messaging.js");

  // assign the listener function to a variable so we can remove it later
  var createRequestListener = function(eventName) {
    return function(details) {
      // console.log('Web request: ' + details.url);
      devToolsConnection.postMessage({type: eventName, details: details});
    }
  }

  var beforeRequestListener = createRequestListener('beforeRequest');
  var completedListener = createRequestListener('completed');

  chrome.tabs.onUpdated.addListener(function(tabId , info) {
      if (info.status == "complete") {
        devToolsConnection.postMessage({type: 'reset', details: info})
        // your code ...
      }
  });

  chrome.webRequest.onBeforeRequest.addListener(
    beforeRequestListener,
    { urls: [
      "http://*/*",
      "https://*/*"
    ] }
  );

  chrome.webRequest.onErrorOccurred.addListener(
    completedListener,
    { urls: [
      "http://*/*",
      "https://*/*"
    ] }
  );

  chrome.webRequest.onCompleted.addListener(
    completedListener,
    { urls: [
      "http://*/*",
      "https://*/*"
    ] }
  );

  devToolsConnection.onDisconnect.addListener(function() {
       chrome.webRequest.onBeforeRequest.removeListener(requestListener);
  });

})
