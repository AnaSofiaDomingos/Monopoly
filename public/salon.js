var socketSalon = io('http://localhost:8080/salon');
//var socketSalon = io('http://129.194.185.13:8080/salon');

function createGame(){
	socketSalon.emit('whoami', $('#pseudoTitle').text());
	var nbplayers = $('#nbPlayers').val();
	socketSalon.emit('createGame', nbplayers);
}

function salon(){
	var pseudo = $('#pseudoTitle').text();
	socketSalon.emit("games");
	// lister les parties
	socketSalon.on('listGames', function(list){
		//$('#saloon').append("<table class='striped'><tr><th>id partie</th><th>nombre de joueurs</th><th>créateur</th><th>Action</th></tr>");
		
		for (var i=0; i<list.length; i++){
			/*$('#saloon').append("<tr><td>" + list[i].idPartie + "</td>");
			$('#saloon').append("<td>" + list[i].c + " / " + list[i].nbJoueurs + "</td>");
			$('#saloon').append("<td>" + list[i].Pseudo + "</td>");
			$('#saloon').append('<td><input type="button" name="joinGame" value="Rejoindre" onclick="joinGame(\''+pseudo+'\','+ list[i].idPartie +')" /></td></tr>');
			*/
			$('#idRoom').append('<li class="collection-item">'+list[i].idPartie+'</li>');
			$('#nbJoueurs').append('<li class="collection-item">'+ list[i].c + " / " + list[i].nbJoueurs +'</li>');
			$('#createur').append('<li class="collection-item">'+ list[i].Pseudo +'</li>');
			$('#actions').append('<li class="collection-item"><input type="button" name="joinGame" value="Rejoindre" onclick="joinGame(\''+
				pseudo+'\','+ list[i].idPartie +')" /></li>');
		}
		//$('#saloon').append("</table>");
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