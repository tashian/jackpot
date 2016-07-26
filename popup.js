// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
// https://developer.chrome.com/extensions/devtools

var port = chrome.runtime.connect({name: "sonic-devtools"});
var muted = false;

document.querySelector("#mute").addEventListener('click', muteUnmute);

function muteUnmute() {
  port.postMessage({type: 'mute'});
  muted = !muted;
  if (muted) {
    document.getElementById("mute-s").innerHTML = "unmute";
  } else {
    document.getElementById("mute-s").innerHTML = "mute";
  }
}
