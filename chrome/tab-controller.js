//
// Tab Management
//
var TabController = new function() {
  var soundManagers = {};

  this.get = function(tabId) {
    if (!(tabId in soundManagers)) {
      tabWasCreated(tabId);
    }
    return soundManagers[tabId];
  }

  this.tabIsAllowedToPlay = function(tabId) {
    if (MuteButtonListener.isMuted()) { return false; }
    if (tabId == chrome.tabs.TAB_ID_NONE || typeof tabId == 'undefined') {
      return false;
    }
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
}
