// chat config
var MESSAGE_LIMIT = 2000;
var USERNAME_LIMIT = 20;
var CHAT_URL = 'https://dragonsat11-chat.herokuapp.com/'

// stream config
var STREAM_URL = 'https://dragonsat11-stream.herokuapp.com/master.m3u8';

// countdown config
var FILM_START = '2020-03-26T22:00:00.000Z';
var FILM_DURATION_MILLISECS = (1 * 60 * 60 * 1000) + (37 * 60 * 1000) + (51.04 * 1000); // 01:37:51.04
var STREAM_PRE_MILLISECS = (15 * 60 * 1000) + (0 * 1000); // 15:00.00
var STREAM_POST_MILLISECS = (5 * 60 * 1000) + (0 * 1000); // 05:00.00
