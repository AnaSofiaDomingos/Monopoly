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

		updateLogs("Player "+idPlayer+" got the salary");
		if (posLocal == 0)
			credit(SALARY*2, idPlayer);
		else
			credit(SALARY, idPlayer);

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
			if (debit(TAXES) == 0) {
				getMyInfos();
				updateLogs("Player "+idPlayer+" paid "+TAXES+" of taxes");
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
			updateLogs("Player "+idPlayer+" goes to jail");
			sentJson.state = S_JAILED;
			sentJson.position = 9;
			jail_time = 3;
			break;

		// Case parking
		case 18:
			var r = Math.random();
			if(r < 1/nbJoueurs) {
				updateLogs("You win 2M at the lottery");
				credit(2);
			} else {
				updateLogs("You havn't won the lottery");
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
					var price = 0.2 * result.lvl * country.Prix;
					if (debitObligatoire(price) == 0)
						credit(price, idPlayer);
				}
			break;
			
	}
		
	sentJson.position = posLocal;
		
	checkUpgradeAvailible();

	transition(idCurrentPlayer, posLocal);

	getInfos(posLocal);
	getMyInfos();

	// Double --> replay
	if (de1 == de2)
		replay(); 
	else {
		$('#btnFinTour').removeAttr("disabled");
		$("#btnDes").attr("disabled", "true");
	}
	
}

function isPossessed(posPays) {

	var country = findCountry(posPays);
	for (var y = 0; y < localJson.length; y++)
		for(var i=0; i<localJson[y].owns.length; i++)
			for(var j=0; j<localJson[y].owns[i].length; j++)
				if(localJson[y].owns[i].country == country.idPays)
					return {'idPlayer': i, 'lvl': localJson[y].owns[i].level };

	return {'idPlayer':-1, 'lvl':-1};
}

function replay() {
	waiting = false;
	myTurn = true;
	replays = true;
	$('#btnDes').removeAttr('disabled');
	$('#btnFinTour').attr('disabled', 'true');
}
function transition(idCurrentPlayer,posLocal) {
	setTimeout(function() {
		var oldPos = joueurs[idCurrentPlayer];
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
