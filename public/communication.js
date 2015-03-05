function finTour(GameID, idCurrentPlayer) {

	var tmp = document.getElementById("btnFinTour").disabled = true;
	tmp = document.getElementById("btnDes").disabled = true;

	// Send data

	var sentJson = {

		"id": idCurrentPlayer,

		"bought": [{
			"land": ""
		}],

		"upgraded": [{
			"land": 35, // Suisse
			"level": "2"
		}],

		"sold": [{
			"land": ""
		}],

		"loaned": [{
			"land": ""
		}],

		"drew": [{
			"card": 0
		}],

		"account": 201500,

		"position": joueurs[idCurrentPlayer],
		"GameID" : GameID

	};

	socket.emit('endofturn',sample);
}

function upgrade(idCurrentPlayer){

	var idPays = joueurs[idCurrentPlayer];

	for (var pays in payspossede){
		if(payspossede[pays].idPays == idPays){
			// upgrade of the country
			sample.upgraded = {
				'land' : idPays,
				'level' : ++payspossede[pays].etatAmelioration
			};

		}
	}

	updateUpgrades(sample.upgraded);

	var etatAmeliorationCurrent = payspossede.
	sample.upgraded = {}
}

function updateUpgrades(data){

	$('#case'+data.Land).children('span.upgrade').remove(); // removes all the upgrades in the country
	if(data.hasOwnProperty('level')) // if a land has been upgraded
		for (var y = 0; y < data.level; y++)
			$('#case'+i).append('<span class="upgrade"></span>');
}

function receiveData(data) {
	console.log(data);
	// idCurrentPlayer = data.id;
	PlayerPos = data.position;
	transition(data.id,PlayerPos);
	var nextPlayer = ((data.id+1)%nbJoueurs);

	var upgraded = data.upgraded;

	updateUpgrades(upgraded);

	console.log("data player "+data.id+" and next is "+nextPlayer+" and i m "+idPlayer);
	if(nextPlayer != idPlayer) {
		var tmp = document.getElementById("btnFinTour").disabled = true;
		tmp = document.getElementById("btnDes").disabled = true;
	} else {
		var tmp = document.getElementById("btnFinTour").disabled = false;
		tmp = document.getElementById("btnDes").disabled = false;
	}
}

