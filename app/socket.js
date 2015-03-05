////////////////////////////
//        SOCKETS         //
////////////////////////////

module.exports = function(server, connection) {

	function initGame(idJoueur, idPartie, callback) {
		var cpt = 0;

		
		var data = {
			'cartes':{},

			'pays' : {},

			// to be send
			'id': idJoueur,

			'GameID' : idPartie,

			'position': 0,

			'account': 0,

			'state' : 0,


			"bought": [{
				'country' : ""
			}],

			"upgraded": [{
				"country": "",
				"level": ""
			}],

			"sold": [{
				"country": ""
			}],

			"loaned": [{
				"country": "",
				"recovered": ""
			}],

			"drew": [{
				"card": ""
			}],

			"used": [{
				'card' : ""
			}],

		};

		// recupère le solde du joueur
		connection.query('SELECT solde FROM parties p LEFT JOIN participe pa ON pa.idPartie = p.idPartie LEFT JOIN joueur j ON j.idJoueur = pa.idJoueur WHERE pa.idJoueur = ' 
			+idJoueur + ' AND pa.idPartie = ' +idPartie, function(err, rows, fields) {
			if (err) throw err;

			data.account = rows[0]["solde"];
			callback(data, ++cpt);
		});

		// recupere la liste des cartes dans la base de données
		connection.query('SELECT * FROM cartes', function(err,rows,fields){
			if (err) throw err;
			data.cartes = rows;
			callback(data, ++cpt);
		});

		// recupere la liste des pays dans la base de données
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

			initGame(data.idGlobal, data.RoomID, function(dataInitGame, cpt) {
				if(cpt == 3)
					socket.emit('PlayerNumber',numberOfPlayer, dataInitGame);
			});

		});

		//END OF TURN
		socket.on('endofturn',function(data){
			console.log(data);
			// end of turn==================================================================
			require('./endofturn.js')(data, connection);

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
