var taillePlateau = 32;
var nbJoueurs = 5;
var plateau = new Array(taillePlateau);
var joueurs = [0, 0, 0, 0, 0, 0];
var posLocal = 0;

function init(idPlayer) {
	console.log(idPlayer);
	console.log(idPlayer > 0);
	if(idPlayer > 0) {
		var tmp = document.getElementById("btnFinTour").disabled = true;
		tmp = document.getElementById("btnDes").disabled = true;
	}

	for (var i = 0; i<taillePlateau; i++) {
		plateau[i] = new Array(nbJoueurs);
	}

	for (var i = 0; i < nbJoueurs; i++) {
		plateau[0][i] = i;
	}

	WriteAllPlayersPosition();
}

function lancerDes(idCurrentPlayer) {
	var tmp = document.getElementById("btnDes").disabled = true;

	var de1 = Math.floor((Math.random() * 6) + 1);
	var de2 = Math.floor((Math.random() * 6) + 1);

	var posJoueur = document.getElementById("case"+joueurs[idCurrentPlayer]);

	posLocal+=de1+de2;
	var btn = document.getElementById("btnDes");
	btn.setAttribute("value", de1+" + "+de2+" = " +(de1+de2));
	posLocal = posLocal%taillePlateau;

	transition(idCurrentPlayer, posLocal);

	$('#btnUpgrade').disabled = true;
	for (var pays in payspossede){
		if(payspossede[pays].idPays == posLocal){ // if we're on one of our country
			$('#btnUpgrade').disabled = false;
		}

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

