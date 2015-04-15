var socketSalon = io('http://localhost:8080/salon');
//var socketSalon = io('http://129.194.185.13:8080/salon');

function createGame(){
	socketSalon.emit('whoami', $('#pseudoTitle').text());
	var nbplayers = $('#nbPlayers').val();
	socketSalon.emit('createGame', nbplayers);
	refresh();
	alert("Partie Créee");
}

function salon(){
	socketSalon.emit("games");
}

	// lister les parties
socketSalon.on('listGames', function(list){
	for (var i=0; i<list.length; i++){
		$('#idRoom').append('<li class="collection-item">'+list[i].idPartie+'</li>');
		$('#nbJoueurs').append('<li class="collection-item">'+ list[i].c + " / " + list[i].nbJoueurs +'</li>');
		$('#createur').append('<li class="collection-item">'+ list[i].Pseudo +'</li>');
		$('#actions').append('<li class="collection-item"><a href="#" onClick="joinGame(\''+
			$('#pseudoTitle').text()+'\','+ list[i].idPartie +')">Rejoindre</a></li>');
	}
});

function refresh(){
	$('#idRoom').empty();
	$('#nbJoueurs').empty();
	$('#createur').empty();
	$('#actions').empty();
	$('#idRoom').append('<li class="collection-header title"><span>Partie</span></li>');
	$('#nbJoueurs').append('<li class="collection-header title"><span>Nombre de joueurs</span></li>');
	$('#createur').append('<li class="collection-header title"><span>Créateur</span></li>');
	$('#actions').append('<li class="collection-header title"><span>Action</span></li>');
	salon();
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