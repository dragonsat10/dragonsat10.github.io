// Prevents input from having injected markup
const cleanInput = (input) => {
  var el = document.createElement('div')
  el.innerText = input;
  var safe = el.innerHTML;
  return dmoji_replace(safe);
}


function dmoji_replace(html) {
  var dmoji = [
    {
      match: [/\B>:\(\B/g, /\B[:(]toothlessalpha[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/hUQq7eebo/toothlessalpha.gif'
    },
    {
      match: [/\B:X\b/g, /\B[:(]toothlessbigeyes[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/vQPq7eec0/toothlessbigeyes.gif'
    },
    {
      match: [/\b8\)\B/g, /\B[:(]toothlessglasses[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/VCwq7eece/toothlessglasses.gif'
    },
    {
      match: [/\B:\$\B/g, /\B[:(]toothlessblush[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/RH8q7eeco/toothlessblush.gif'
    },
    {
      match: [/\B-_-\B/g, /\B[:(]toothlessclosedeyes[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/lO2q7eedz/toothlessclosedeyes.gif'
    },
    {
      match: [/\B:D\b/g, /\B[:(]toothlessgrin[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/kcaq7eeel/toothlessgrin.gif'
    },
    {
      match: [/\B:'\)\$\B/g, /\B[:(]toothlesshappytears[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/4ICq7eeex/toothlesshappytears.gif'
    },
    {
      match: [/\B<3\b/g, /\B[:(]toothlesshearts[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/idoq7eef8/toothlesshearts.gif'
    },
    {
      match: [/\bXD\b/g, /\B[:(]toothlesslaugh[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/q4vq7eefj/toothlesslaugh.gif'
    },
    {
      match: [/\B:O\b/g, /\B[:(]toothlesssurprised[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/qDoq7eefr/toothlesssurprised.gif'
    },
    {
      match: [/\B:\'\(\B/g, /\B[:(]toothlesstears[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/LSPq7eeg4/toothlesstears.gif'
    },
    {
      match: [/\B:[pP]\b/g, /\B[:(]toothlesstongue[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/OYuq7eegg/toothlesstongue.gif'
    },
    {
      match: [/\B:\(\B/g, /\B[:(]toothlessunhappy[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/vg6q7eegx/toothlessunhappy.gif'
    },
    {
      match: [/\B:\)\B/g, /\B[:(]toothlesssmile[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/G3iq7eehf/toothlesssmile.gif'
    },
    {
      match: [/\B:[\\\/]\B/g, /\B[:(]toothlessunimpressed[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/LgAq7eeht/toothlessunimpressed.gif'
    },
    {
      match: [/\B;\)\B/g, /\B[:(]toothlesswink[:)]\B/g],
      image: 'https://static.tumblr.com/kthl4hs/uCGq7eei4/toothlesswink.gif'
    }
  ]
  for (var i = 0; i < dmoji.length; i++) {
    for (var j = 0; j < dmoji[i].match.length; j++) {
      var img = '<img class="dmoji" src="' + dmoji[i].image + '" />'
      html = html.replace(dmoji[i].match[j], img);
    }
  }
  return html;
}


$(function() {
  var WELCOME_MESSAGE = 'Welcome to the DragonsAt11 chat';
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $users = $('.users'); // Users area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var users = [];
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io(CHAT_URL);

  const addParticipantsMessage = (data) => {
    /*var message = '';
    if (data.users.length === 1) {
      message += "there's 1 participant";
    } else {
      message += 'there are ' + data.users.length + ' participants';
    }
    log(message);*/
  }

  const updateUsersList = (newUsers) => {
    // remove any users that have left
    for (var i = 0; i < users.length; i++) {
      if (newUsers.indexOf(users[i]) === -1) {
        // the user has left - remove them
        var child = $($users.children()[i])
        child.fadeOut(function () {
          $(this).remove();
        });
        users.splice(i, 1);
      }
    }

    // add in any new users
    for (var i = 0; i < newUsers.length; i++) {
      if (users.indexOf(newUsers[i]) === -1) {
        // this is a new user - add them
        var $el = $('<li class="user"/>')
          .text(newUsers[i])
          .css('color', getUsernameColor(newUsers[i]));
        $el.hide().fadeIn(FADE_TIME);
        $users.append($el);
        users.push(newUsers[i]);
      }
    }
  }

  // Sets the client's username
  const setUsername = () => {
    var chosenUsername = $usernameInput.val().trim();

    // If the username is valid
    if (chosenUsername) {
      // Tell the server your username
      if (chosenUsername.length <= USERNAME_LIMIT) {
        socket.emit('add user', chosenUsername);
      }
    }
  }

  // Sends a chat message
  const sendMessage = () => {
    var message = $inputMessage.val().trim();
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      // tell server to execute 'new message' and send along one parameter
      if (message.length <= MESSAGE_LIMIT) {
        socket.emit('new message', message);
      }
    }
  }

  // Log a message
    const log = (message, options) => {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  const addChatMessage = (data, options) => {
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    // clean the message
    var message = cleanInput(data.message);

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .html(message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  // Adds the visual chat typing message
  const addChatTyping = (data) => {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  const removeChatTyping = (data) => {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  const addMessageElement = (el, options) => {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Updates the typing event
  const updateTyping = () => {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(() => {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  const getTypingMessages = (data) => {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  const getUsernameColor = (username) => {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(event => {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', () => {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(() => {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(() => {
    $inputMessage.focus();
  });

  // Socket events

  // if the username has already been used
  socket.on('reject', (data) => {
    $usernameInput.val('');
    alert('Username is already in use');
  })

  // Whenever the server emits 'login', log the login message
  socket.on('login', (data) => {
    // set the username
    username = $usernameInput.val().trim();

    // switch windows
    $loginPage.fadeOut();
    $chatPage.show();
    $loginPage.off('click');
    $currentInput = $inputMessage.focus();

    connected = true;
    // Display the welcome message
    var message = WELCOME_MESSAGE;
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
    updateUsersList(data.users);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', (data) => {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', (data) => {
    log(data.username + ' joined');
    addParticipantsMessage(data);
    updateUsersList(data.users);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', (data) => {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
    updateUsersList(data.users);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', (data) => {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', (data) => {
    removeChatTyping(data);
  });

  socket.on('disconnect', () => {
    log('you have been disconnected');
  });

  socket.on('reconnect', () => {
    log('you have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', () => {
    log('attempt to reconnect has failed');
  });

});
