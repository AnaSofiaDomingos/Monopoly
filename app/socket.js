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
	var allPlayers = null;
	var numberOfPlayer = 0;

	function getNbPlayersInRoom(RoomID){
		var compteur = 0;
		for (var socket in io.nsps['/subscribe'].adapter.rooms[RoomID] )
			compteur++;
		return compteur;
	}

	nsp.on('connection', function(socket){

		// HANDSHAKING
		socket.on('handshake',function(data){
			socket.join(data.RoomID);
			console.log('user joined the room ' + data.RoomID);
			allPlayers = [];
			allPlayers.push({"socket" : socket, "roomID" : data.RoomID});

			numberOfPlayer = getNbPlayersInRoom(data.RoomID);

			getNbPlayers(data.RoomID, function(nbplayer){
				console.log(numberOfPlayer);
				socket.broadcast.to(data.RoomID).emit('Loading', numberOfPlayer, nbplayer);
			});

			initGame(data.idGlobal, data.RoomID, function(dataInitGame, cpt) {
				if(cpt == 3){
					getNbPlayers(data.RoomID, function(nbplayer){
						socket.emit('PlayerNumber',numberOfPlayer-1, dataInitGame,nbplayer);
					});
				}
			});
		});



		socket.emit('PlayersConnected', (numberOfPlayer));

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

			if(allPlayers != null && allPlayers[0] !== undefined){

				var i = allPlayers.indexOf(socket);
				var index = -1;

				for (var i = 0; i < allPlayers.length; i++){
					if(allPlayers[i].socket === socket)
						index = i;
				}

				var roomID = allPlayers[index].roomID; // save the room ID
				allPlayers.splice(index, 1); // removes the player from the list
				numberOfPlayer = getNbPlayersInRoom(roomID);

				getNbPlayers(roomID, function(nbplayer){
					socket.broadcast.to(roomID).emit('somebodyLeft',numberOfPlayer,nbplayer);
				});

				console.log("user left room " + data);
			}

		});

		//ROBBED
		socket.on('robbed', function(sample) {
			socket.broadcast.to(sample.gameID).emit('robbed', sample);
		});

	});

	var acc = io.of('/account');
	
	acc.on('connection', function(socket){
		socket.on('register', function(account) {
			getPseudoExists(account, function(exists){
				console.log(""+exists);
				socket.emit("loginExists", exists);
				if(!exists) {
					connection.query('INSERT INTO joueurs (pseudo, mdp, position, etat, solde) VALUES (\''+account.login+'\', md5(\''+account.pass+'\'), 0, 0, 0)', function(err, rows, fields) {
						if (err) throw err;
					});
				}
			});
			
		});
	});

	function getPseudoExists(account, callback) {
		connection.query('SELECT pseudo FROM joueurs WHERE pseudo = \''+account.login+'\'', function(err, rows, fields) {
				if (err) throw err;
				if(rows[0]) {
					callback(true);
				} else {
					callback(false);
				}
			});
	}


}
