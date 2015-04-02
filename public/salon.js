var socketSalon = io('http://localhost:8080/salon');

var data = {
	'RoomID'  : null,
	'idGlobal' : null
};

function createGame(){
	socketSalon.emit('whoami', $('#pseudoTitle').text());
	var nbplayers = $('#nbPlayers').val();
	socketSalon.emit('createGame', nbplayers);
}

function salon(){

	$('#saloon').append("<h3>Liste des parties disponibles</h3>");
	$('#saloon').append("<table><tr>");
	$('#saloon').append("<th>id partie</th><th>nombre de joueurs</th><th>créateur</th><th>Action</th></tr>");

	// lister les parties
	socketSalon.on('listGames', function(list){
		console.log(list);

		for (var i=0; i<list.length; i++){
			$('#saloon').append("<tr>");
			$('#saloon').append("<td>" + list[i].idPartie + "</td>");
			$('#saloon').append("<td>" + list[i].nbJoueurs + "</td>");
			$('#saloon').append("<td>" + list[i].pseudo + "</td>");
			$('#saloon').append('<td><input type="button" name="joinGame" value="Rejoindre" onClick="joinGame('+ list[i].idPartie +');" /></td>');
			$('#saloon').append("</tr>");
		}
	});
}

function joinGame(id){
	data.RoomID = id;

	/*socketSalon.emit('whoami', pseudo);
	socketSalon.on('myid', function(id){
		data.idGlobal = id;
	}); */

	data.idGlobal = 1;
	socketSalon.emit('handshake', data); // tell the server which game this user is part of
}