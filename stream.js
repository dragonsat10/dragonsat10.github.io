var filmStartDate = new Date(FILM_START);

var enabled = false;

function enableVideo() {
  var now = new Date();
  var enableTime = new Date(filmStartDate.getTime() - STREAM_PRE_MILLISECS);
  var disableTime = new Date(filmStartDate.getTime() + FILM_DURATION_MILLISECS + STREAM_POST_MILLISECS);
  var enableDistance = enableTime.getTime() - now.getTime();
  var disableDistance = disableTime.getTime() - now.getTime();
  if (disableDistance <= 0) {
    if (enabled) {
      if (player && !player.paused()) {
        player.pause();
      }
      enabled = false;
    }
  }
  else if (enableDistance <= 0) {
    if (!enabled) {
      // set the video
      if (player) {
        player.src({ type:'application/x-mpegURL', src: STREAM_URL });
      }
      enabled = true;
    }
  }
}


var options = {
  plugins: {
    httpSourceSelector: {
      default: 'auto'
    }
  }
};
var player = videojs('dragon-stream', options);
player.httpSourceSelector();

// when player ready, do we enable it?
player.ready(function () {
  enableVideo();
  setInterval(enableVideo, 500);
})
