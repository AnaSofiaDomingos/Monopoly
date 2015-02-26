function finTour(GameID, idCurrentPlayer) {

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

	/*
	$.ajax({
		type: "PUT",
		dataType:'json',
		url: "/endofturn",
		contentType: 'application/json',
		data: JSON.stringify(sample)
	})
		.done(function( msg ) {
		alert( "Data Saved: " + msg );
		}); */
}



function receiveData(data) {
	console.log(data);
	idCurrentPlayer = data.id;
	PlayerPos = data.position;
	transition(idCurrentPlayer,PlayerPos);
}
