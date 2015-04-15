var socket = io('http://129.194.185.13:8080/subscribe');

//gvar socket = io('http://' + domain + ':' + port +  '/subscribe');

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
	nbJoueurs = nbPlayer;
	terminateGame();
	/*
	if(nbPlayer == totalPlayer)
		$('#loadingGame').addClass("hideit");
	else
		$('#loadingGame').removeClass("hideit");
	*/
});

socket.on('notify',function(data){
	console.log(data);
	receiveData(data);
});



socket.on("SomebodyLost",function(idLooser){
	updateLogs("player " + idLooser + " lost !");
	nbJoueurs--;
	terminateGame();
});


socket.on('PlayerNumber',function(idLocal,dataInitGame,totalPlayer){
	idPlayer = idLocal;
	nbJoueurs = totalPlayer;
	for (var i = 0; i < totalPlayer;i++)
		localJson.push({
			"owns" :  [],
			"cards" : [],
			"loans" : []
		});

	$('#whoareyou').addClass('player' + idPlayer);
	$('#loading').append((idPlayer + 1) + "/" + totalPlayer);
	if((idPlayer + 1) == totalPlayer)
		$('#loadingGame').addClass("hideit");


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
		"paid" : [{}],
		"nextPlayer" : idPlayer
	};

	updateUpgrades(sentJson.upgraded);
	init(idPlayer);
	placeCountriesCartes();
	getMyInfos(idPlayer);
});

