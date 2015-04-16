var socketSalon = io('http://'+domain+':8080/salon');

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function createGame(){
	$('#errorsCreation').show();
	socketSalon.emit('whoami', $('#pseudoTitle').text());
	if (isNumber($('#nbPlayers').val())){
		var nbplayers = $('#nbPlayers').val();
		socketSalon.emit('createGame', nbplayers);
		refresh();
		$('#errorsCreation').css("color", "green");
		$('#errorsCreation').text("Game created");
	}else if (!isNumber($('#nbPlayers').val())) {
		$('#errorsCreation').css("color", "red");
		$('#errorsCreation').text("You have to specify a number");
	}
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