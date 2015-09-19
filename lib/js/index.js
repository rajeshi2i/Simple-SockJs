// Create a connection to http://localhost:9999/echo

var sock = new SockJS('/echo');

// Open the connection
sock.onopen = function() {
  console.log('open');
};

// On connection close
sock.onclose = function() {
  console.log('close');
};

// On receive message from server
sock.onmessage = function(e) {
  // Get the content
  var content = JSON.parse(e.data);

  // Append the text to text area (using jQuery)
  $('#chat-content').append(function(i, text) {
    return '<div class="row"><span class="username col-xs-2">' + content.username + '</span><span class="msg col-xs-10">' + content.message + '<span></div>';
  }).animate({ scrollTop: $('#chat-content')[0].scrollHeight }, 1000);

};

// Function for sending the message to server
function sendMessage() {
  // Get the content from the textbox
  var message = $('#message').val();
  var username = $('#username').val();

  // The object to send
  var send = {
    message: message,
    username: username
  };
  if(message != '' && username != ''){
    // Send it now
    $('#message').val('');
    sock.send(JSON.stringify(send));
  }

}

$(window).resize(function() {
  setChatContentAreaHeight();
});

$(window).load(function() {
  setChatContentAreaHeight();
});

function setChatContentAreaHeight(){
  $('#chat-content').height($(window).height() - 110 + 'px');
}
