TrackerChecker = new function() {
  this.trackers = {}

  var that = this;
  $.getJSON(chrome.extension.getURL('/vendor/data/services.json'), function(trackers) {
    _.map(trackers.categories, function(ownerList, category) {
      _.each(ownerList, function(ownerCollection) {
        _.map(ownerCollection, function(domainCollection, owner) {
          _.map(domainCollection, function(domains, baseUrl) {
            _.each(domains, function(domain) {
              that.trackers[domain] = { category: category, ownerName: owner, baseUrl: baseUrl }
            });
          });
        });
      });
    });
  });

  this.hostnameFromUrl = function(url) {
    var urlParser = document.createElement('a');
    urlParser.href = url;
    return urlParser.hostname;
  }

  this.lookupTracker = function(hostname) {
    var tracker = this.trackers[hostname];
    // This is a naive approach for turning www.google.com into google.com.
    // It works for ads.doubleclick.co.uk but not for ads1.ads.doubleclick.com.
    // A Better Way would be to use the Public Suffix List instead.
    if (!tracker && hostname.indexOf('.') != -1) {
      hostname = hostname.slice(hostname.indexOf('.') + 1);
      tracker = this.trackers[hostname];
    }
    return tracker;
  }

  this.isTrackingRequest = function(pageUrl, requestUrl) {
    var requestHostname = this.hostnameFromUrl(requestUrl);
    var tracker = this.lookupTracker(requestHostname);
    if (!tracker) { return false; }

    var pageHostname = this.hostnameFromUrl(pageUrl);
    var trackerHostname = this.hostnameFromUrl(tracker.baseUrl);
    if (trackerHostname == pageHostname) {
      return false;
    } else {
      return true;
    }
  }
}
