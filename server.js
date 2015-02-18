var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    hostname = process.env.HOSTNAME || 'localhost',
    port = parseInt(process.env.PORT, 10) || 8080;

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var mysql      = require('mysql');

/* DISTANT SERVER MYSQL
var connection = mysql.createConnection({
  host     : 'kwib.myd.infomaniak.com',
  user     : 'kwib_monopoly',
  password : 'Super2008',
  database : 'kwib_monopoly'
});
*/


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'monopoly'
});

/* BDD CONNEXION
connection.connect();
connection.end();
*/

io.on('connection', function(){ /* NOTIFICATIONS SOCKETIO */ });


// routes ======================================================================
require('./app/routes.js')(app);

app.use(methodOverride());
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(express.static(__dirname + '/public'));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

console.log("server listening at http://" + hostname + ":" + port);
app.listen(port, hostname);
