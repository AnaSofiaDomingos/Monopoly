var taillePlateau = 30;
var nbJoueurs = 6;
var plateau = new Array(taillePlateau);
var idLocal = 0;
var joueurs = [5, 10, 6, 15, 27, 22];
var posLocal = 0;


function init() {
	for (var i = 0; i<taillePlateau; i++) {
		plateau[i] = new Array(nbJoueurs);
	}

	for (var i = 0; i < nbJoueurs; i++) {
		plateau[0][i] = i;
	}

	for(var i = 0; i<taillePlateau;i++) {
		var span = document.createElement('span');
		span.setAttribute("id", "span"+i);
		span.innerHTML = "|___| ";
		document.body.appendChild(span);
	}

	WritePlayersPosition();
}

function lancerDes() {
	ResetPlateau();
	var de1 = Math.floor((Math.random() * 6) + 1);
	var de2 = Math.floor((Math.random() * 6) + 1);		
	
	var posJoueur = document.getElementById("span"+joueurs[idLocal]);

	posLocal+=de1+de2;
	posLocal = posLocal%taillePlateau;
	joueurs[idLocal] = posLocal;

	WritePlayersPosition();
}

function ResetPlateau(){
	for(var i = 0; i<taillePlateau;i++) {
		var span = document.getElementById('span'+i);
		span.innerHTML = "|___| ";
	}
}

function WritePlayersPosition(){
	for(var i = 0; i<nbJoueurs; i++) {
		var posJoueur = document.getElementById("span"+joueurs[i]);
		posJoueur.innerHTML += i;
	}
}