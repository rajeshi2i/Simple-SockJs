var express        = require('express');
var http           = require('http');
var sockjs         = require('sockjs');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require("mongoose");

// Clients list
var clients = {};

// Broadcast to all clients
function broadcast(message){
  // iterate through each client in clients object
  for (var client in clients){
    // send the message to that client
    clients[client].write(JSON.stringify(message));
  }
}

// create sockjs server
var echo = sockjs.createServer();

// on new connection event
echo.on('connection', function(conn) {

  // add this client to clients object
  clients[conn.id] = conn;

  // on receive new data from client event
  conn.on('data', function(message) {
    console.log(message);
    broadcast(JSON.parse(message));
  });

  // on connection close event
  conn.on('close', function() {
    delete clients[conn.id];
  });
  
});

// Express server
var app = express();

app.use(express.static(__dirname + '/public')); // set the static files location
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser()); // pull information from html in POST
app.use(methodOverride()); // simulate DELETE and PUT

//Add the routes
routes = require('./routes/chat')(app);

// Create an http server
var server = http.createServer(app);

// Integrate SockJS and listen on /echo
echo.installHandlers(server, {prefix:'/echo'});

// MongoDB configuration
mongoose.connect('mongodb://localhost/chat', function(err, res) {
  if(err) {
    console.log('error connecting to MongoDB Database. ' + err);
  } else {
    console.log('Connected to Database');
  }
});

// Start server
app.set('port', (process.env.PORT || 5000));

app.use("/", express.static(__dirname + "/"));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

