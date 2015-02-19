var taillePlateau = 32;
var nbJoueurs = 6;
var plateau = new Array(taillePlateau);
var idLocal = 5;
var joueurs = [0, 0, 9, 0, 0, 0];
var posLocal = 0;


function init() {
	for (var i = 0; i<taillePlateau; i++) {
		plateau[i] = new Array(nbJoueurs);
	}

	for (var i = 0; i < nbJoueurs; i++) {
		plateau[0][i] = i;
	}


	WritePlayersPosition();
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
		joueurs[idLocal] = (joueurs[idLocal]+1)%taillePlateau;
		WritePlayersPosition();

		if(joueurs[idLocal] != posLocal)
			transition();
	}, 500);
}

function ResetPlateau(){
	for(var i = 0; i<taillePlateau;i++) {
		var div = document.getElementById("case"+i);
		div.innerHTML = "";
	}
}

function WritePlayersPosition(){

	ResetPlateau();
	for(var i = 0; i<nbJoueurs; i++) {
		var posJoueur = document.getElementById("case"+joueurs[i]);
		alert("ok");
		var rond = document.createElement("div");
		rond.setAttribute("class", "pion player"+(i+1));
		posJoueur.appendChild(rond);
		
	}
}

