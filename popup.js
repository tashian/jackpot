// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
// https://developer.chrome.com/extensions/devtools

var port = chrome.runtime.connect({name: "sonic-devtools"});

document.querySelector("#mute").addEventListener('click', muteUnmute);
document.querySelector("#reset").addEventListener('click', resetAll);

function muteUnmute() {
  port.postMessage({type: 'mute'});
}

function resetAll() {
  port.postMessage({type: 'reset'});
}
