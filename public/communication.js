function finTour() {
	// Send data
	var idJoueur = 7;
	/*var jsone = {
		"id": idJoueur,
		"position" : joueurs[idLocal],

		"bought"
	};*/

	var sample = {

	  "id": idJoueur,
	  
	  "bought": {
		"land": "France"
	  },
	  
	  "upgraded": {
		"land": "Qatar",
		"level": "2"
	  },
	  
	  "sold": {
	    "land": "Italy"
	  },
	  
	  "loaned": {
	    "land": "Switzerland"
	  },

	  "drew": {
	    "card": "21"
	  },
	  
	  "account": "201500",
	  
	  "position": joueurs[idLocal]
	  
	};

	$.ajax({
	  type: "PUT",
	  dataType:'json', 
	  url: "/endofturn",
	  contentType: 'application/json',
	  data: JSON.stringify(sample) 
	})
	  .done(function( msg ) {
	    alert( "Data Saved: " + msg );
	  });
}


function receiveData() {

}
