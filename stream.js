var options = {
  plugins: {
    httpSourceSelector: {
      default: 'auto'
    }
  }
};
var player = videojs('dragon-stream', options);
player.httpSourceSelector();

// listen to messages from parent window
window.addEventListener('message', function (message) {
  if (message.data === 'pause') {
    if (player && !player.paused()) {
      player.pause();
    }
  } else if (message.data === 'play') {
    if (player) {
      player.src({ type:'application/x-mpegURL', src: STREAM_URL });
    }
  }
}, false);
