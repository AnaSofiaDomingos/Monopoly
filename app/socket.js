////////////////////////////
//        SOCKETS         //
////////////////////////////

module.exports = function(server, connection) {

	function initGame(callback, compteur) {
		var cpt = 0;
		var data = {'cartes':{},'pays' : {}} ;

		connection.query('SELECT * FROM cartes', function(err,rows,fields){
			if (err) throw err;
			data.cartes = rows;
			callback(data, ++cpt);
		});

		connection.query('SELECT * FROM pays', function(err, rows, fields) {
			if (err) throw err;
			data.pays = rows;
			callback(data, ++cpt);
		});
	}

	var io = require('socket.io')(server);
	var nsp = io.of('/subscribe');
	var roomsTable = [];
	var numberOfPlayer = 0;

	function test(RoomID){
		var compteur = -1;
		for (var socket in io.nsps['/subscribe'].adapter.rooms[RoomID] )
			compteur++;
		return compteur;
	}

	nsp.on('connection', function(socket){


		// HANDSHAKING
		socket.on('handshake',function(data){
			socket.join(data.RoomID);
			console.log('user joined the room ' + data.RoomID);
			roomsTable.push(data.RoomID);
			numberOfPlayer = test(data.RoomID);

			initGame(function(dataInitGame, cpt) {
				if(cpt == 2)
					socket.emit('PlayerNumber',numberOfPlayer, dataInitGame);
			});

		});

		//END OF TURN
		socket.on('endofturn',function(data){
			console.log(data);
			// end of turn==================================================================
			require('./endofturn.js')(data, mysql);

			socket.broadcast.to(data.GameID).emit('notify',data);
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


	});
}
