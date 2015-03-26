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


			"bought": [],

			"upgraded": [],

			"sold": [],

			"loaned": [],

			"drew": [],

			"used": [],

		};

		// recupère le solde du joueur
		connection.query('SELECT solde FROM parties p LEFT JOIN participe pa ON pa.idPartie = p.idPartie LEFT JOIN joueurs j ON j.idJoueur = pa.idJoueur WHERE pa.idJoueur = ' 
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

	function getNbPlayers(idPartie, callback){
		connection.query('SELECT nbJoueurs FROM parties WHERE idPartie = ' +idPartie, function(err, rows, fields) {
			if (err) throw err;
			callback(rows[0]["nbJoueurs"]);
		});
	}

	var io = require('socket.io')(server);
	var nsp = io.of('/subscribe');
	var roomsTable = [];
	var numberOfPlayer = 0;

	function getNbPlayersInRoom(RoomID){
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
			numberOfPlayer = getNbPlayersInRoom(data.RoomID);

			getNbPlayers(data.RoomID, function(nbplayer){
				socket.broadcast.to(data.RoomID).emit('Loading', numberOfPlayer, nbplayer);
			});

			initGame(data.idGlobal, data.RoomID, function(dataInitGame, cpt) {
				if(cpt == 3){
					getNbPlayers(data.RoomID, function(nbplayer){
						socket.emit('PlayerNumber',numberOfPlayer, dataInitGame,nbplayer);
					});
				}
			});
		});



		socket.emit('PlayersConnected', (numberOfPlayer+1));

		//END OF TURN
		socket.on('endofturn',function(data){
			console.log(data);
			// end of turn==================================================================
			require('./endofturn.js')(data, connection);

			socket.broadcast.to(data.GameID).emit('notify',data);
		});
		
		socket.on('ILost',function(data){
			socket.broadcast.to(data.GameID).emit('SomebodyLost',data.idPlayer);
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

		//ROBBED
		socket.on('robbed', function(sample) {
			socket.broadcast.to(sample.gameID).emit('robbed', sample);
		});

	});

}
