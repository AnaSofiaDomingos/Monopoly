//var socket = io('http://129.194.185.13:8080/subscribe');
var socket = io('http://localhost:8080/subscribe');
socket.emit('handshake', data); // tell the server which game this user is part of

socket.on('Loading', function(nbPlayer, totalPlayer){
	$('#loading').empty();
	$('#loading').append( nbPlayer  + "/" + totalPlayer );
	if(nbPlayer == totalPlayer)
		$('#loadingGame').addClass("hideit");
	else
		$('#loadingGame').removeClass("hideit");
});

socket.on("somebodyLeft",function(nbPlayer,totalPlayer){
	$('#loading').empty();
	$('#loading').append( nbPlayer  + "/" + totalPlayer );
	if(nbPlayer == totalPlayer)
		$('#loadingGame').addClass("hideit");
	else
		$('#loadingGame').removeClass("hideit");
});

socket.on('notify',function(data){
	receiveData(data);
});

function finPlayer(){

	var data = {
		'GameID' : GameID,
		'idPlayer' : idPlayer
	};

	socket.emit("ILost",data);
	nbJoueurs--;
	terminateGame();
}

socket.on("SomebodyLost",function(idLooser){
	updateLogs("player " + idLooser + " lost !");
	nbJoueurs--;
	terminateGame();
});


socket.on('PlayerNumber',function(idLocal,dataInitGame,totalPlayer){
	idPlayer = idLocal;
	$('#whoareyou').addClass('player' + idPlayer);
	$('#loading').append((idPlayer + 1) + "/" + totalPlayer);
	if((idPlayer + 1) == totalPlayer)
		$('#loadingGame').addClass("hideit");

	dataInitGame.upgraded = [{
		"country": 25, // Suisse
		"level": "2"
	}];

	nbJoueurs = totalPlayer;
	countries = dataInitGame.pays;
	cards = dataInitGame.cartes;

	sentJson = {
		"id": idPlayer,

		"bought": dataInitGame.bought,

		"upgraded": dataInitGame.upgraded,

		"sold" : dataInitGame.sold,
		"used" : dataInitGame.used,

		"loaned": dataInitGame.loaned,

		"drew": dataInitGame.drew,
		"recovered" : dataInitGame.recovered,
		"account": dataInitGame.account,
		"state" : dataInitGame.state,
		"position": joueurs[idPlayer],
		"GameID" : GameID,
		"paid" : [{}]
	};

	updateUpgrades(sentJson.upgraded);
	init(idPlayer);
	placeCountriesCartes();
	getMyInfos(idPlayer);
});

