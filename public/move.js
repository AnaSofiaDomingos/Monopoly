var taillePlateau = 36;
var nbJoueurs;
var plateau = new Array(taillePlateau);
var posLocal = 0;

function init(idPlayer) {
	myTurn = true;
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
	$('#btnFinTour').attr("disabled", "true");
	checkUpgradeAvailible();
	
	WriteAllPlayersPosition();
}

// check if btn upgrade should be enabled or not
function checkUpgradeAvailible(){
	for (var property in localJson[sentJson.id].owns){
		for (var property = 0; property < localJson[sentJson.id].owns.length; property++){
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
	// Publicitary campaign income
	if (sentJson.state == S_PUBLIC) { 
		credit(PUBLIC_INCOME);
		buff_time--;
		// State reset
		if (buff_time == -1) sentJson.state = S_ALIVE;
	}

	// Debuff time decrease
	if (debuff_time >= 0) {
		debuff_time--;

		// Recover backup state if debuff is over and clean
		if (debuff_time == -1) {
			for (var i = 0; i < backup.length; i++)
				for (var j = 0; j < localJson[idPlayer].owns.length; j++)
					if (localJson[idPlayer].owns[j].country == backup[i].country) {
						localJson[idPlayer].owns[j].level = backup[i].level;
						sentJson.upgraded.push(localJson[idPlayer].owns[j]);
					}
			backup = [{}];
		}
	}

	// Getting out of jail
	if (jail_time == 0)
		sentJson.state = S_ALIVE;

	var de1 = Math.floor((Math.random() * 6) + 1);
	var de2 = Math.floor((Math.random() * 6) + 1);
	
	var posJoueur = $("#case"+joueurs[idCurrentPlayer]);
	posLocal += de1 + de2;

	$("#btnDes").attr("value", de1+" + "+de2+" = " +(de1+de2));

	// If jailed, must do a double 
	if ((sentJson.state == S_JAILED) && (de1 == de2)) {
		updateLogs("Vous êtes sorti de prison");
	}
	else if ((sentJson.state == S_JAILED) && (de1 != de2)){
		updateLogs("Vous restez en prison");
		jail_time -= 1;
	}
		
	// Salary
	if (posLocal >= taillePlateau) {
		posLocal %= taillePlateau;

		if (posLocal == 0) {
			credit(SALARY*2);
			updateLogs("Vous obtenez le double de votre salaire (4)");
		}
		else {
			credit(SALARY);
			updateLogs("Vous obtenez votre salaire (2)");
		}

		getMyInfos();
	}

	// Special positions
	switch (posLocal) {

		// Case départ
		case 0	: break; 

		// Taxes
		case 3  :
		case 12 :
		case 21 :
		case 30 :
			if (debitObligatoire(TAXES) == 0) {
				getMyInfos();
				updateLogs("Vous avez payé " + TAXES + " aux impôts");
			}
			break;
			
		// Cartes
		case 6  :
		case 15 :
		case 24 :
		case 33 :
			tirerCarte();
			break;
			
		// Aller en prison
		case 27 :
			goToJail(idPlayer);
			break;

		// Case parking
		case 18:
			var r = Math.random();
			if(r < 1/nbJoueurs) {
				updateLogs("Vous avez gagné 2'000'000 à la loterie");
				credit(2);
			} else {
				updateLogs("Merci d'avoir joué à la loterie !");
			}
			break;

		// Pays
		default	:
			var result = isPossessed(posLocal);
			// Country is possessed			
			if (result.lvl >= 0)
				// if not our country
				if (result.idPlayer != idPlayer)	{
					var country = findCountry(posLocal);
					// Price defined by lvl of upgrade (see documentation)
					var price = 0.2 * (result.lvl + 1) * country.Prix;
					if (debitObligatoire(price) == 0){
						updateLogs("Vous avez payé " + price + "M à " + result.idPlayer);
						credit(price, result.idPlayer);
						getMyInfos();
					}
				}
			break;
			
	}
		
	sentJson.position = posLocal;
		
	checkUpgradeAvailible();

	if (sentJson.state != S_JAILED)
		transition(idCurrentPlayer, posLocal);

	getInfos(posLocal);
	getMyInfos();

	// Double --> replay
	if ((de1 == de2) || (replays)) 
		replay(); 
	else {
		$('#btnFinTour').removeAttr("disabled");
		$("#btnDes").attr("disabled", "true");
	}
	
}

function isPossessed(posPays) {
	if (posPays == 0 | posPays == 3 | posPays == 6 | posPays == 9 | posPays == 12 | posPays == 15 |
	posPays == 18 | posPays == 21 | posPays == 24 | posPays == 27 | posPays == 30 | posPays == 33){
		return {
		     'idPlayer' : -1, 
			 'lvl'      : -1
		   };
	}
	var country = findCountry(posPays);
	var isLoaned = false;
	for (var p = 0; p < localJson.length; p++){

		if(localJson[p].owns == null)
			continue;
		else{
			for (var i = 0; i < localJson[p].loans.length;i++){
				if(localJson[p].loans[i].country == country.idPays){
					updateLogs("Chanceux ! Ce pays a été hypothéqué par son propriétaire ~(O_O)~");
					isLoaned = true;
				}
			}
			if(!isLoaned)
				for (var i = 0; i < localJson[p].owns.length; i++)
					if (localJson[p].owns[i].country == country.idPays)
						return {
								'idPlayer': p,
								'lvl'     : localJson[p].owns[i].level
								};
		}
	}

	return {
		    'idPlayer' : -1,
			'lvl'      : -1
		   };
	
}

function replay() {
	myTurn = true;
	replays = true;
	$("#btnDes").attr("disabled", "true");
	$('#btnFinTour').attr('disabled', 'true');
}

function transition(idCurrentPlayer,posLocal) {
	setTimeout(function() {
		var oldPos = joueurs[idCurrentPlayer];
		joueurs[idCurrentPlayer] = (joueurs[idCurrentPlayer]+1)%taillePlateau;
		WritePlayerAtPosition(idCurrentPlayer,oldPos, joueurs[idCurrentPlayer]);

		if(joueurs[idCurrentPlayer] != posLocal) {
			transition(idCurrentPlayer,posLocal);
		} else {
			if(replays) {
				$('#btnDes').removeAttr("disabled");
				replays = false;
			}
		}
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
	if(sentJson.state != S_DEAD) {
		posJoueur = document.getElementById("case"+newPos);
		posJoueur.appendChild(pion);
	}
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

function goToJail(idPlayer){
	sentJson.state = S_JAILED;
	updateLogs("Vous allez en prison");
	posLocal = 9;
	jail_time = 3;
	transition(idPlayer, 9);
}