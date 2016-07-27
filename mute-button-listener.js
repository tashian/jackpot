var MuteButtonListener = new function() {
  var muted = false;

  chrome.storage.local.get('muted', function(item) {
    if (item.muted) { muted = item.muted; }
  });

  chrome.storage.onChanged.addListener(function(changes) {
    if ('muted' in changes) {
      var storageChange = changes['muted'];
      muted = storageChange.newValue;
    }
  });

  this.isMuted = function() {
    return muted;
  }
}
