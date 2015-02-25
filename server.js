var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    hostname = process.env.HOSTNAME || 'localhost',
    port = parseInt(process.env.PORT, 10) || 8080;

var server = require('http').createServer(app);

app.use(bodyParser.json());

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
    host     : '129.194.185.13',
    user     : 'monopoly',
    password : 'Super2008',
    database : 'monopoly'
});

/* BDD CONNEXION
connection.connect();
connection.end();
*/


// routes ======================================================================
require('./app/routes.js')(app, connection);
// socket ======================================================================
require('./app/socket.js')(server);


app.use(methodOverride());
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(express.query());
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
app.listen(port);
