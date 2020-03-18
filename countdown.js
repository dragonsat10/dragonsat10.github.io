// get reference to stream iframe
var streamIframe = document.getElementById('stream-iframe').contentWindow;

// get the localised time
var filmStartDate = new Date(FILM_START);

function twoPad(number) {
  if (number.toString().length != 1) return number.toString()
  return "0" + number.toString()
}

// function for setting the correct localised time
function updateTime() {
  document.getElementById('day').innerText = twoPad(filmStartDate.getDate());
  document.getElementById('month').innerText = filmStartDate.toLocaleString('default', { month: 'long' });
  document.getElementById('year').innerText = filmStartDate.getFullYear();
  document.getElementById('hour').innerText = twoPad(filmStartDate.getHours());
  document.getElementById('minute').innerText = twoPad(filmStartDate.getMinutes());
  document.getElementById('zone').innerText = filmStartDate.toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];

  // also update the minute pre count
  var preTimeMinutes = Math.trunc((STREAM_PRE_MILLISECS / 60) / 1000);
  var elements = document.getElementsByClassName('stream-pre-minutes')
  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];
    el.innerText = preTimeMinutes;
  }
}

// function for updating the counter
function updateCounter() {
  var now = new Date();
  var distance = filmStartDate.getTime() - now.getTime();

  if ((distance * -1) >= FILM_DURATION_MILLISECS) {
    // the film has ended
    document.getElementById('countdown').style.display = 'none';
  } else if (distance <= 0) {
    // film has started
    document.getElementById('countdown-label').innerText = 'film time';
    document.getElementById('countdown-days-container').style.display = 'none';

    // the distance is the other way round now
    var distance =  now.getTime() - filmStartDate.getTime();
  }

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById('countdown-days').innerText = days;
  document.getElementById('countdown-days-s').innerText = (days == 1) ? '' : 's';
  document.getElementById('countdown-hours').innerText = twoPad(hours);
  document.getElementById('countdown-minutes').innerText = twoPad(minutes);
  document.getElementById('countdown-seconds').innerText = twoPad(seconds);
}

function enableVideo() {
  var now = new Date();
  var enableTime = new Date(filmStartDate.getTime() - STREAM_PRE_MILLISECS);
  var disableTime = new Date(filmStartDate.getTime() + FILM_DURATION_MILLISECS + STREAM_POST_MILLISECS);
  var enableDistance = enableTime.getTime() - now.getTime();
  var disableDistance = disableTime.getTime() - now.getTime();
  if (disableDistance <= 0) {
    if (document.getElementById('dragon-stream').style.display === 'none') {
      // disable the stream - but not chat! - and update the messages to say that things are over
      document.getElementById('dragon-stream').style.display = 'none';
      document.getElementById('stream-placeholder').style.display = 'flex';
      document.getElementById('stream-placeholder').innerHTML = '<p>The livestream is over! Thanks for stopping by!</p>'
      //if (player && !player.paused()) {
      if (streamIframe) {
        streamIframe.postMessage('pause', '*');
        //player.pause();
      }

      // enable the chat
      //document.getElementById('chat-placeholder').style.display = 'none';
      //document.getElementById('dragon-chat').style.display = 'block';
    }
  }
  else if (enableDistance <= 0) {
    if (document.getElementById('stream-placeholder').style.display !== 'none') {
      // set the video
      if (streamIframe) {
        //player.src({ type:'application/x-mpegURL', src: STREAM_URL });
        streamIframe.postMessage('play', '*');
      }

      // enable the stream/chat
      document.getElementById('stream-placeholder').style.display = 'none';
      //document.getElementById('chat-placeholder').style.display = 'none';
      document.getElementById('dragon-stream').style.display = 'block';
      //document.getElementById('dragon-chat').style.display = 'block';
    }
  }
}

// update the localised time
updateTime();

// run the updatecounter function every 0.5 seconds, and also right now
setInterval(updateCounter, 500);
updateCounter();

// enable/disable the stream/chat, and check every second
enableVideo();
setInterval(enableVideo, 1000);
