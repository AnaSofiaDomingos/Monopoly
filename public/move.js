var taillePlateau = 36;
var nbJoueurs = 5;
var plateau = new Array(taillePlateau);
var joueurs = [0, 0, 0, 0, 0, 0];
var posLocal = 0;
var posLocal = 25;

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

function lancerDes(idCurrentPlayer) {
	var tmp = document.getElementById("btnDes").disabled = true;

	var de1 = Math.floor((Math.random() * 6) + 1);
	var de2 = Math.floor((Math.random() * 6) + 1);

	var posJoueur = document.getElementById("case"+joueurs[idCurrentPlayer]);

	posLocal+=de1+de2;
	var btn = document.getElementById("btnDes");
	btn.setAttribute("value", de1+" + "+de2+" = " +(de1+de2));
	posLocal = posLocal%taillePlateau;

	checkUpgradeAvailible();

	transition(idCurrentPlayer, posLocal);

	$('#btnFinTour').disabled = false;
	
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

function replay() {

	$('#btnDes').disabled = false;
	$('#btnFinTour').disabled = true;
	return 1;
	
}
