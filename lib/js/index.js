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
    $('#chat-content').append(constructChatView(content.name, content.message)).animate({
        scrollTop: $('#chat-content')[0].scrollHeight
    }, 1000);
};

function constructChatView(name, message){
  return '<div class="row"><span class="username col-xs-2">' + name + '</span><span class="msg col-xs-10">' + message + '<span></div>';
}

// Function for sending the message to server
function sendMessage() {
    // Get the content from the textbox
    var message = $('#message').val();
    var username = $('#username').val();

    // The object to send
    var send = {
        message: message,
        name: username
    };
    if (message != '' && username != '') {
        // Send it now
        $('#message').val('');
        $.post("/chat", {
            name: username,
            message: message
        }, function(data, status) {
            console.log("Data: " + data + "\nStatus: " + status);
        });
        sock.send(JSON.stringify(send));
    }

}

$(window).resize(function() {
    setChatContentAreaHeight();
});

$(window).load(function() {
    loadRecentChats();
    setChatContentAreaHeight();
    $("#message").keypress(function(e) {
        if (e.which == 13) {
            sendMessage();
        }
    });
    $("#username").keypress(function(e) {
        if (e.which == 13) {
            $("#message").focus();
        }
    });
});

function setChatContentAreaHeight() {
    $('#chat-content').height($(window).height() - 110 + 'px');
}

function loadRecentChats(){
  $.get("/chat-limit", function(data, status){
    $.each(data,function(key,val){
      $('#chat-content').append(constructChatView(val.name, val.message));
    });
    $('#chat-content').animate({
        scrollTop: $('#chat-content')[0].scrollHeight
    }, 1000);
  });
}

