
module.exports = function(server, connection) {

	var io = require('socket.io')(server);	
	var salon = io.of('/salon');		// jeu
	// récupère l'id en fonction du pseudo
	function getIdFromPseudo(pseudo, callback){
		connection.query('SELECT idJoueur FROM joueurs WHERE pseudo = ' + pseudo, function(err, rows, fields){
			if (err) throw err;
			callback(rows[0]["idJoueur"]);
		});
	}

	salon.on('connection', function(socket){
		//création de partie
		var login = 'Ana';
		getIdFromPseudo(login, function(id){

		console.log(id);
		socket.on('createGame', function(nbplayers){

			console.log(nbplayers);
			connection.query('INSERT INTO parties  (nbJoueurs, idJoueur) VALUES (' +
								nbplayers + ", " + id ,function(err, rows, fields) {
				if (err) throw err;
			});
		});
	});
}