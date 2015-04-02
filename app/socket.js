////////////////////////////
//        SOCKETS         //
////////////////////////////

module.exports = function(server, connection) {


	// récupère les informations initiale pour le commencement d'une partie
	function initGame(idJoueur, idPartie, callback) {
		var cpt = 0;
		var data = {
			'cartes':{},	// liste de tout les pays dans la base de données
			'pays' : {},	// liste de toutes les cartes dans la base de données
			'id': idJoueur,
			'GameID' : idPartie,
			'position': 0,
			'account': 20,
			'state' : 0,
			"bought": [],
			"upgraded": [],
			"sold": [],
			"loaned": [],
			"drew": [],
			"used": []
		};

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

	// récupère le nombre de joueurs maximum pour une partie
	function getNbPlayers(idPartie, callback){
		connection.query('SELECT nbJoueurs FROM parties WHERE idPartie = ' +idPartie, function(err, rows, fields) {
			if (err) throw err;
			callback(rows[0]["nbJoueurs"]);
		});
	}

	// récupère le nombre de joueurs dans une room
	function getNbPlayersInRoom(RoomID){
		var compteur = 0;
		for (var socket in io.nsps['/subscribe'].adapter.rooms[RoomID] )
			compteur++;
		return compteur;
	}

	// vérifie si le pseudo existe déjà dans la base données
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

	// Test login
	function verifyLogin(account, callback) {
		connection.query('SELECT * FROM joueurs WHERE pseudo = \''+account.login+'\' AND mdp = \''+account.pass+'\'', function(err, rows, fields) {
			if (err) throw err;
			callback(rows[0]);
		});
	}

	// récupère l'id en fonction du pseudo
	function getIdFromPseudo(pseudo, callback){
		connection.query('SELECT idJoueur FROM joueurs WHERE pseudo = \'' +pseudo+ '\'', function(err, rows, fields){
			if (err) throw err;
			callback(rows[0]["idJoueur"]);
		});
	}

	// recupère la liste des parties
	function listGames(callback){
		connection.query('SELECT * FROM parties p JOIN joueurs j ON p.idJoueur = j.idJoueur WHERE p.finie = -1', function(err, rows, fields){
			if (err) throw err;
			callback(rows);
		});
	}

	var io = require('socket.io')(server);	
	var nsp = io.of('/subscribe');		// jeu
	var acc = io.of('/account');		// comptes
	var salon = io.of('/salon');		// salon
	var allPlayers = null;
	var numberOfPlayer = 0;

	/* =============================================================================================================================================
														FONCTIONS SOCKET POUR LE JEU
	============================================================================================================================================= */

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
				if(cpt == 2){
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
			require('./endofturn.js')(data, connection);

			socket.broadcast.to(data.GameID).emit('notify',data);
		});

		// ERROR HANDLER
		socket.on('error',function(err){
			console.log('Une erreur est survenue avec les sockets : ' + err);
		});


		//DISCONNECTING
		socket.on('disconnect', function(data){
			if(allPlayers != null && allPlayers[0] !== undefined){

				var i = allPlayers.indexOf(socket);
				var index = -1;

				for (var i = 0; i < allPlayers.length; i++){
					if(allPlayers[i].socket === socket)
						index = i;
				}
				if (index != -1) {
					var roomID = allPlayers[index].roomID; // save the room ID
					allPlayers.splice(index, 1); // removes the player from the list
					numberOfPlayer = getNbPlayersInRoom(roomID);

					getNbPlayers(roomID, function(nbplayer){
						socket.broadcast.to(roomID).emit('somebodyLeft',numberOfPlayer,nbplayer);
					});
				}

				console.log("user left room " + data);
			}

		});

		//ROBBED
		socket.on('robbed', function(sample) {
			socket.broadcast.to(sample.gameID).emit('robbed', sample);
		});

	});


	/* =============================================================================================================================================
														FONCTIONS SOCKET POUR LE COMPTE
	============================================================================================================================================= */

	acc.on('connection', function(socket){
		// création de compte
		socket.on('register', function(account) {
			getPseudoExists(account, function(exists){

				socket.emit("loginExists", exists);
				if(!exists) {
					connection.query('INSERT INTO joueurs (pseudo, mdp, position, etat, solde) VALUES (\''+
						account.login+'\', md5(\''+account.pass+'\'), 0, 0, 0)', function(err, rows, fields) {
						if (err) throw err;
					});
				}
			});
			
		});


		// login
		socket.on('login', function(account) {
			verifyLogin(account, function(infos){
				socket.emit("loginSuccess", infos);
		 	});
		});
	});

	salon.on('connection', function(socket){
		socket.on('whoami', function(login){
			console.log(login);
			//création de partie
			getIdFromPseudo(login, function(id){
				socket.on('createGame', function(nbplayers){
					connection.query('INSERT INTO parties VALUES ("",' + nbplayers + ',' + id + ', -1)' ,function(err, rows, fields) {
						if (err) throw err;
						console.log("game created");
					}); 
				});
			});
		});

		listGames(function(list){
			socket.emit("listGames", list);
		});
	});
}