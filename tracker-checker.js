var TrackerChecker = new function() {
  var allTrackers = {};
  $.getJSON(chrome.extension.getURL('/vendor/data/services.json'), function(trackers) {
    _.map(trackers.categories, function(ownerList, category) {
      _.each(ownerList, function(ownerCollection) {
        _.map(ownerCollection, function(domainCollection, owner) {
          _.map(domainCollection, function(domains, baseUrl) {
            _.each(domains, function(domain) {
              allTrackers[domain] = { category: category, ownerName: owner, baseUrl: baseUrl }
            });
          });
        });
      });
    });
  });

  this.lookup = function(pageUrl, requestUrl) {
    var requestHostname = hostnameFromUrl(requestUrl);
    var tracker = lookupByHostname(requestHostname);
    if (!tracker) { return undefined; }

    if (trackerIsThirdParty(pageUrl, tracker.baseUrl)) {
      return tracker;
    } else {
      return undefined;
    }
  }

  function hostnameFromUrl(url) {
    var urlParser = document.createElement('a');
    urlParser.href = url;
    return urlParser.hostname;
  }

  function lookupByHostname(hostname) {
    var tracker = allTrackers[hostname];
    // This is a naive approach for turning www.google.com into google.com.
    // It works for ads.doubleclick.co.uk but not for ads1.ads.doubleclick.com.
    // A Better Way would be to use the Public Suffix List instead.
    if (!tracker && hostname.indexOf('.') != -1) {
      naiveFQDN = hostname.slice(hostname.indexOf('.') + 1);
      tracker = allTrackers[naiveFQDN];
    }
    return tracker;
  }

  function trackerIsThirdParty(pageUrl, trackerBaseUrl) {
    var pageHostname = hostnameFromUrl(pageUrl);
    var trackerHostname = hostnameFromUrl(trackerBaseUrl);
    return (trackerHostname != pageHostname);
  }
}
