var muted = false;

document.querySelector("#mute").addEventListener('click', muteUnmute);

function muteUnmute() {
  chrome.storage.local.set({'muted': !muted}, function() {
    muted = !muted;
    document.getElementById("mute-s").innerHTML = (muted ? "un" : "") + "mute";
  });
}

window.onload = function() {
  chrome.storage.local.get('muted', function(item) {
    if (item.muted) { muteUnmute(); }
  })
}
