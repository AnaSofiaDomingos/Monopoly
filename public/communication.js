function finTour(GameID, idCurrentPlayer) {

	var tmp = document.getElementById("btnFinTour").disabled = true;
	tmp = document.getElementById("btnDes").disabled = true;

	// Send data
	

	var sample = {

		"id": idCurrentPlayer,

		"bought": {
			"land": ""
		},

		"upgraded": {
			"land": "",
			"level": ""
		},

		"sold": {
			"land": ""
		},

		"loaned": {
			"land": ""
		},

		"drew": {
			"card": 0
		},

		"account": 201500,

		"position": joueurs[idCurrentPlayer],
		"GameID" : GameID

	};

	socket.emit('endofturn',sample);
}



function receiveData(data) {
	console.log(data);
	// idCurrentPlayer = data.id;
	PlayerPos = data.position;
	transition(data.id,PlayerPos);
	var nextPlayer = ((data.id+1)%nbJoueurs);
	console.log("data player "+data.id+" and next is "+nextPlayer+" and i m "+idPlayer);
	if(nextPlayer != idPlayer) {
		var tmp = document.getElementById("btnFinTour").disabled = true;
		tmp = document.getElementById("btnDes").disabled = true;
	} else { 
		var tmp = document.getElementById("btnFinTour").disabled = false;
		tmp = document.getElementById("btnDes").disabled = false;
	}
}

