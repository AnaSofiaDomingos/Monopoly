////////////////////////////
//        SOCKETS         //
////////////////////////////

module.exports = function(server, connection) {

	function initGame(idJoueur, idPartie, callback) {
		var cpt = 0;

		var country = [{
			"id" : 0,
			"level" : 0,
			"loaned" : 0
		}];

		var card = [{
			"id" : 0
		}];

		var data = {
			'id': idJoueur,

			'position': 0,

			'gameID' : idPartie,

			'account': 0,

			"bought": [{
				'country' : ""
			}],

			"upgraded": [{
				"country": "",
				"level": ""
			}],

			"sold": {
				"country": ""
			},

			"loaned": [{
				"country": ""
			}],

			"drew": {
				"card": card
			},

			'cartes':{},
			'pays' : {}
		};



		connection.query('SELECT solde FROM parties p LEFT JOIN participe pa ON pa.idPartie = p.idPartie LEFT JOIN joueurs j ON j.idJoueur = pa.idJoueur WHERE pa.idJoueur = ' 
			+idJoueur + ' AND pa.idPartie = ' +idPartie, function(err, rows, fields) {

			if (err) throw err;

			data.account = rows[0]["solde"];
			callback(data, ++cpt);
		});

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


		connection.query('SELECT idCarte FROM possedecarte WHERE idJoueur = '+ idJoueur+' AND idPartie = '+ idPartie , function(err,rows,fields){
			if (err) throw err;

			for (var i=0; i < rows.length; i++)
				card[i] = rows[i]["idCarte"];
			
			data.drew = card;
			callback(data, ++cpt);
		});

		connection.query('SELECT idPays, etatHypotheque, etatAmelioration FROM possedepays WHERE idJoueur = '+ idJoueur+' AND idPartie = '+ idPartie , function(err,rows,fields){
			if (err) throw err;

			for (var i=0; i < rows.length; i++){
				data.bought[i]["country"] = rows[i]["idPays"];
				data.upgraded[i]["country"] = rows[i]["idPays"];
				data.upgraded[i]["level"] = rows[i]["etatAmelioration"];
				if (rows[i]["etatHypotheque"] == 1)
					data.loaned[i]["country"] =  rows[i]["idPays"];
			}
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
				console.log(cpt);
				if(cpt == 5)
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
