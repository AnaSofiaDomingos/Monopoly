function finTour() {
	// Send data
	var idJoueur = idGlobal;

	var sample = {

			"id": idJoueur,

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

		"position": joueurs[idLocal]

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



function receiveData(idPartie) {
	
}
