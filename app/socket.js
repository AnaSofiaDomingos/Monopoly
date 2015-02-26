////////////////////////////
//        SOCKETS         //
////////////////////////////

module.exports = function(server, mysql) {

	var io = require('socket.io')(server);
	//io.set("origins","*");

	var nsp = io.of('/subscribe');

	var roomsTable = [];

	nsp.on('connection', function(socket){


		// HANDSHAKING
		socket.on('handshake',function(data){
			socket.join(data);
			console.log('user joined the room ' + data);
			roomsTable.push(data);

		});

		//END OF TURN
		socket.on('endofturn',function(data){
			console.log(data);
			// end of turn==================================================================
			require('./endofturn.js')(data, mysql);
		});

		// ERROR HANDLER
		socket.on('error',function(err){
			console.log('Une erreur est survenue avec les sockets : ' + err);
		});


		//DISCONNECTING
		socket.on('disconnect', function(data){
			// Do stuff (probably some jQuery)
			console.log("user left room " + data);
		});

		//socket.broadcast.to(1).emit('test', "YOLO");

	});
}