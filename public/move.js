var taillePlateau = 36;
var nbJoueurs = 5;
var plateau = new Array(taillePlateau);
var joueurs = [0, 0, 0, 0, 0, 0];
var posLocal = 0;

function init(idPlayer) {
	// console.log(idPlayer);
	// console.log(idPlayer > 0);
	if(idPlayer > 0) {
		document.getElementById("btnFinTour").disabled = true;
		document.getElementById("btnDes").disabled = true;
	}

	joueurs[idPlayer] = posLocal;
	sentJson.position = posLocal;

	for (var i = 0; i<taillePlateau; i++) {
		plateau[i] = new Array(nbJoueurs);
	}

	for (var i = 0; i < nbJoueurs; i++) {
		plateau[0][i] = i;
	}

	$('#btnUpgrade').attr("disabled", "true");
	checkUpgradeAvailible();
	
	WriteAllPlayersPosition();
}

// check if btn upgrade should be enabled or not
function checkUpgradeAvailible(){
	console.log();
	for (var property in localJson[sentJson.id].owns){
		// console.log("-"+property);
		console.log(localJson[sentJson.id].owns.length);
		for (var property = 0; property < localJson[sentJson.id].owns.length; property++){
			console.log("- "+property + " -> " + localJson[sentJson.id].owns[property].country);
			if(localJson[sentJson.id].owns[property].country == posLocal){ // enables the btn
				$('#btnUpgrade').removeAttr("disabled");
				break;
			} else {
				$('#btnUpgrade').attr("disabled", "true");
			}
		}
	}
}

function lancerDes(idCurrentPlayer) {

	// Getting out of jail
	if (jail_time == 0)
		sentJson.state = S_ALIVE;

	var de1 = Math.floor((Math.random() * 6) + 1);
	var de2 = Math.floor((Math.random() * 6) + 1);
	var posJoueur = $("#case"+joueurs[idCurrentPlayer]);

	// If jailed, must do a double 
	if ((sentJson.state != S_JAILED) || ((sentJson.state == S_JAILED) && (de1 == de2))) {
		posLocal += de1 + de2;
		sentJson.state = S_ALIVE;
		$("#btnDes").attr("value", de1+" + "+de2+" = " +(de1+de2));
	}
	else if ((sentJson.state == S_JAILED) && (de1 != de2))
		jail_time -= 1;
		
	// Salary
	if (posLocal >= taillePlateau) {
		posLocal %= taillePlateau;
		if (posLocal == 0)
			credit(SALARY*2, idPlayer);
		else
			credit(SALARY, idPlayer);
	}
	// Special positions
	else
		switch (posLocal) {
		
			// Taxes
			case 3, 12, 21, 30 :
				if (debitObligatoire(TAXES) == 0)
					console.log("Player "+idPlayer+" paid "+TAXES+" of taxes");
				break;
				
			// Cartes
			case 6, 15, 24, 33 :
				var card = tirerCarte();
				break;
				
			// Aller en prison
			case 27 :
				sentJson.state = S_JAILED;
				sentJson.position = 9;
				jail_time = 3;
				break;
				
		}
		
	sentJson.position = posLocal;
		
	checkUpgradeAvailible();

	transition(idCurrentPlayer, posLocal);

	// Double --> replay
	if (de1 == de2) { 
		console.log(de1+" = "+de2);
		replay(); 
	}
	else {
		$('#btnFinTour').attr('disabled', false);
		$("#btnDes").attr('disabled', true);
		console.log(de1+" != "+de2);
	}
	
}

function replay() {
	$('#btnDes').attr('disabled', false);
	$('#btnFinTour').attr('disabled', true);
}

function transition(idCurrentPlayer,posLocal) {
	setTimeout(function() {
		var oldPos = joueurs[idCurrentPlayer];
		console.log(joueurs);
		joueurs[idCurrentPlayer] = (joueurs[idCurrentPlayer]+1)%taillePlateau;
		WritePlayerAtPosition(idCurrentPlayer,oldPos, joueurs[idCurrentPlayer]);

		if(joueurs[idCurrentPlayer] != posLocal)
			transition(idCurrentPlayer,posLocal);
	}, 300);
}

function ResetPlateau(){
	for(var i = 0; i<taillePlateau;i++) {
		var div = document.getElementById("case"+i);
		div.innerHTML = "";
	}
}

function WritePlayerAtPosition(idCurrentPlayer,oldPos, newPos){
	var posJoueur = document.getElementById("case"+oldPos);
	var pion = document.getElementById("player"+(idCurrentPlayer+1));
	posJoueur.removeChild(pion);
	posJoueur = document.getElementById("case"+newPos);
	posJoueur.appendChild(pion);
}

function WriteAllPlayersPosition(){
	ResetPlateau();
	for(var i = 0; i<nbJoueurs; i++) {
		var posJoueur = document.getElementById("case"+joueurs[i]);
		var pion = document.createElement("div");
		pion.setAttribute("id", "player"+(i+1));
		pion.setAttribute("class", "pion");
		posJoueur.appendChild(pion);

	}
}