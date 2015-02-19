var taillePlateau = 32;
var nbJoueurs = 6;
var plateau = new Array(taillePlateau);
var idLocal = 0;
var joueurs = [0, 0, 5, 0, 0, 0];
var posLocal = 0;


function init() {
	for (var i = 0; i<taillePlateau; i++) {
		plateau[i] = new Array(nbJoueurs);
	}

	for (var i = 0; i < nbJoueurs; i++) {
		plateau[0][i] = i;
	}

	WriteAllPlayersPosition();
}

function lancerDes() {
	var de1 = Math.floor((Math.random() * 6) + 1);
	var de2 = Math.floor((Math.random() * 6) + 1);		

	var posJoueur = document.getElementById("case"+joueurs[idLocal]);

	posLocal+=de1+de2;
	var btn = document.getElementById("btnDes");
	btn.setAttribute("value", de1+" + "+de2+" = " +(de1+de2));
	posLocal = posLocal%taillePlateau;

	transition();
}

function transition() {
	setTimeout(function() {
		var oldPos = joueurs[idLocal]; 
		joueurs[idLocal] = (joueurs[idLocal]+1)%taillePlateau;
		WritePlayerAtPosition(oldPos, joueurs[idLocal]);

		if(joueurs[idLocal] != posLocal)
			transition();
	}, 300);
}

function ResetPlateau(){
	for(var i = 0; i<taillePlateau;i++) {
		var div = document.getElementById("case"+i);
		div.innerHTML = "";
	}
}

function WritePlayerAtPosition(oldPos, newPos){
	var posJoueur = document.getElementById("case"+oldPos);
	var pion = document.getElementById("player"+(idLocal+1));
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

