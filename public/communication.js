
function finTour() {

	$("#btnFinTour").attr('disabled' , true);
	$("#btnDes").attr('value', 'Lancer les dés');
	$("#btnDes").attr('disabled' , true);

	// Send data
	socket.emit('endofturn',sentJson);
	resetSentJson();
	RemoveInfos();
	myTurn = false;
	replays = false;
}

function upgrade(idCurrentPlayer){
	var posPays = joueurs[idCurrentPlayer];
	var pays = findCountry(posPays);
	var idPays = pays.idPays;
	var upCountry = getUpByCountry(idPays);
	var newLvl = prompt("Quel genre d'amélioration voulez-vous effectuer ?", getUpByCountry(idPays));
	var modified = false;
	newLvl = parseInt(newLvl);
	if(newLvl <= maxUpgrade) {
		if (newLvl > upCountry) {
			var price = getUpdatePrice(pays.Prix, newLvl);
			
			var r = debit(price);
			if (r == 0) {
				updateLogs(pays.NomPays + " amélioré au niveau "+newLvl+" ("+price+")");
				modified = true;
			} else {
				updateLogs("Vous n'avez pas assez d'argent (il vous manque "+r+")");
				modified = false;
			}
		} else if (newLvl == upCountry) {
			updateLogs("Impossible d'améliorer au même niveau");
			modified = false;
		} else if (newLvl < upCountry)
			if (newLvl >= 0) {
				var alreadyPaid = getUpdatePrice(pays.Prix, upCountry);
				var newPrice = getUpdatePrice(pays.Prix, newLvl);
				var diff = alreadyPaid-newPrice;
				credit(diff);
				modified = true;
				updateLogs(pays.NomPays + " descendu au niveau "+newLvl+" ("+diff+")");
				getMyInfos();
			}

		if(modified) {
			// upgrade of the country
			sentJson.upgraded.push({
				'country' : idPays,
				'level' : newLvl
			});

			for(var i = 0; i<localJson[idPlayer].owns.length; i++) {
				if(localJson[idPlayer].owns[i].country == idPays)
					localJson[idPlayer].owns[i].level = newLvl;
			}

			updateUpgrades(sentJson.upgraded);
			getInfos(posPays, idPays);
		}
	} else {
		updateLogs("Impossible d'améliorer au niveau "+newLvl+" (Max. "+maxUpgrade+")");
	}
}

function getUpdatePrice(paysPrix, level) {
	switch(level) {
		case 1 : return (paysPrix*0.3);
		break;
		case 2 : return (paysPrix*0.4);
		break;
		case 3 : return (paysPrix*0.7);
		break;
		case 4 : return (paysPrix*1.2);
		break;
		default :
			return -1;
		break;
	}
}

function getUpByCountry(idCountry) {
	for(var i = 0; i<localJson[sentJson.id].owns.length; i++) {
		if(localJson[sentJson.id].owns[i].country == idCountry)
			return localJson[sentJson.id].owns[i].level;
	}
	return -1;
}



function resetSentJson(){
	sentJson.upgraded = [];
	sentJson.bought = [];
	sentJson.sold = [];
	sentJson.drew = [];
	sentJson.loaned = [];
	sentJson.used = [];
	sentJson.paid = [];
}

//function to remove a value from the json array
function removeItem(obj, prop, val) {
    var c, found=false;
    for(c in obj) {
        if(obj[c][prop] == val) {
            found=true;
            break;
        }
    }
    if(found){
        obj.splice(c,1);
    }
}

function grade(country, level) {

	for (var i = 0; i < localJson.length; i++)
		for (var j = 0; j < localJson[i].owns.length; j++)
			if (localJson[i].owns[j].country == country) {
				localJson[i].owns[j].level = level;
				sentJson.upgraded.push({
					'country' : localJson[i].owns[j].country,
					'level'   : 0
				});
			}

}

function receiveData(data) {

	//data.bought.splice(0,1);

	if(data.state != S_DEAD) {
		// update list of bought countries
		if(typeof data.bought !== [])
			for (var i = 0; i < data.bought.length; i++){
				if (typeof data.bought[i].country !== 'undefined') {
					localJson[data.id].owns.push({ 'country' : data.bought[i].country , 'level' : 0}); // level is always = 0 when just bought
					//updateUI
					var paysTest = getCountryById(data.bought[i].country);
					$('#case'+paysTest.Position).addClass("player"+ data.id);
				}
			}

		// update list of cards countries
		if(typeof data.drew !== [])
			localJson[data.id].cards.push({'card' : data.drew});

		// update list of owned cards
		if(typeof data.used !== [])
			for(i = 0; i < data.used.length; i++)
				removeItem(countries.results,'card',data.used[i].card);

		// update list of level of countries countries
		if(typeof data.upgraded !== [])
			for (i = 0; i < localJson[data.id].owns.length; i++)
				for (var y = 0; y < data.upgraded.length; y++)
					if(localJson[data.id].owns[i].country == data.upgraded[y].country)
						localJson[data.id].owns[i].level = data.upgraded[y].level;

		// update list of cards loaned
		if(typeof data.loaned !== [])
			for (i = 0; i < data.loaned.length; i++)
				if(!data.loaned[i].recovered)
					localJson[data.id].loans.push(data.loaned);
				else{
					removeItem(data.loaned,'country',data.loaned[i].country);
					removeItem(localJson[data.id].loans,'country',data.loaned[i].country);
				}
					

		console.log(data.sold);
		// update list of sold countries
		if(typeof data.sold !== [])
			for(var i = 0; i < data.sold.length; i++){
				//updateUI

				if (typeof data.sold[i].country !== 'undefined') {
					var paysTest = getCountryById(data.sold[i].country);
					$('#case'+paysTest.Position).removeClass("player" + data.id);
					$('#case'+paysTest.Position).children().remove("span.upgrade");
					removeItem(countries.owns,'country',data.sold[i].country);
					removeItem(localJson[data.id].owns,'country',data.sold[i].country)
				}
			}

		if(typeof data.paid !== [{}])
			for(i = 0; i < data.paid.length; i++)
				if(data.paid[i])
					if(data.paid[i].player == idPlayer) {
						updateLogs("Le joueur " +data.id+" vous a payé "+data.paid[i].amount.toString().substring(0,6));
						credit(data.paid[i].amount);
						removeItem(data.paid[i], 'player', idPlayer);
					}

		PlayerPos = data.position;
		transition(data.id,PlayerPos);
	}

	var nextPlayer = ((data.id+1)%nbJoueurs);


	updateUpgrades(localJson[data.id].upgraded);

	console.log(data.state);
	if(data.state == S_DEAD){ // if somebody lost we check if the game is over
		nbJoueurs--;
		localJson[data.id].owns = [];
		localJson[data.id].loans = [];
		terminateGame();
	}

	$("#btnFinTour").attr('disabled' , true);

	if (nextPlayer != idPlayer) {
		terminateGame();
		$("#btnDes").attr('disabled' , true);
		$("#btnUpgrade").attr('disabled' , true);
		$("#btnFinTour").attr('disabled' , true);
		$("#btnBuy").attr('disabled' , true);
	} else {
		if(sentJson.state == S_DEAD) {
			var posJoueur = document.getElementById("case"+data.position);
			var pion = document.getElementById("player"+(data.id+1));
			posJoueur.removeChild(pion);
			finTour();
		} else {
			$("#btnDes").attr('disabled' , false);

			myTurn = true;
			waiting = false;
			getMyInfos();
		}
	}

}


