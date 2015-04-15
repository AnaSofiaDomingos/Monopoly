var socketSalon = io('http://localhost:8080/salon');

function createGame(){
	socketSalon.emit('whoami', $('#pseudoTitle').text());
	var nbplayers = $('#nbPlayers').val();
	socketSalon.emit('createGame', nbplayers);
}

function salon(){
	console.log("salon");
	var pseudo = $('#pseudoTitle').text();
	socketSalon.emit("games");
	// lister les parties
	socketSalon.on('listGames', function(list){
		console.log("in salon");
		$('#saloon').append("<h3>Liste des parties disponibles</h3>");
		$('#saloon').append("<table><tr>");
		$('#saloon').append("<th>id partie</th><th>nombre de joueurs</th><th>créateur</th><th>Action</th></tr>");
		
		for (var i=0; i<list.length; i++){
			$('#saloon').append("<tr>");
			$('#saloon').append("<td>" + list[i].idPartie + "</td>");
			$('#saloon').append("<td>" + list[i].nbJoueurs + "</td>");
			$('#saloon').append("<td>" + list[i].pseudo + "</td>");
			$('#saloon').append('<td><input type="button" name="joinGame" value="Rejoindre" onclick="joinGame(\''+pseudo+'\','+ list[i].idPartie +')" /></td>');
			$('#saloon').append("</tr>");
		}
	});
}

function joinGame(pseudo , idPartie){
	socketSalon.emit('whoami', pseudo);
	socketSalon.emit("join", idPartie);
	socketSalon.on('myid', function(idGlobal){
		localStorage.setItem("idGlobal", idGlobal);
		localStorage.setItem("idPartie", idPartie);
		$(location).attr('href',"/game.html");
	});

}