
function finTour(GameID, idCurrentPlayer) {

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
	var newLvl = prompt("Quel genre d'amélioration voulez-vous effectuer ?", getUpByCountry(idPays));
	var price;
	switch(parseInt(newLvl)) {
		case 1 : price=pays.Prix*0.3;
		break;
		case 2 : price=pays.Prix*0.4;
		break;
		case 3 : price=pays.Prix*0.7;
		break;
		case 4 : price=pays.Prix*1.2;
		break;
		default :
			return -1;
		break;
	}

	var r = debit(price);
	if(r == 0)
		window.alert(pays.NomPays + " amelioré !");
	else
		window.alert("Il manque "+r+" pour acheter "+pays.NomPays);

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
}

function getUpByCountry(idCountry) {
	for(var i = 0; i<localJson[sentJson.id].owns.length; i++) {
		if(localJson[sentJson.id].owns[i].country == idCountry)
			return localJson[sentJson.id].owns[i].level;
	}
	return -1;
}

// update UI
function updateUpgrades(data){
	for (var i = 0; i < data.length; i++){
		// retrieves the position of a country from it's id
		for ( var iter = 0; iter < countries.length; iter++)
			if(countries[iter].idPays == data[i].country)
				var posPays = countries[iter].Position;

		$('#case'+posPays).children('span.upgrade').remove(); // removes all the upgrades in the country
		for (var y = 0; y < data[i].level; y++) {
			$('#case'+posPays).append('<span class="upgrade"></span>');
		}
	}
}

function resetSentJson(){
	sentJson.upgraded = [{}];
	sentJson.bought = [{}];
	sentJson.sold = [{}];
	sentJson.drew = [{}];
	sentJson.loaned = [{}];
	sentJson.used = [{}];
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

	// update list of sold countries
	if(typeof data.sold !== [])
		for(var i = 0; i < data.sold.length; i++){
			//updateUI

			if (typeof data.sold[i].country !== 'undefined') {
				var paysTest = getCountryById(data.sold[i].country);
				$('#case'+paysTest.Position).removeClass("player" + data.id);
				removeItem(countries.owns,'country',data.sold[i].country);
			}
		}
	// update list of cards countries
	if(typeof data.drew !== [])
		localJson[data.id].cards.push(data.drew);

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

	// update list of cards countries
	if(typeof data.loaned !== [])
		for (i = 0; i < data.loaned.length; i++)
			if(!data.loaned[i].recovered)
				localJson[data.id].loans.push(data.loaned);

	// update list of bought countries
	if(typeof data.loaned !== [])
		for(i = 0; i < data.loaned.length; i++)
			if(data.loaned[i].recovered)
				removeItem(data.loaned,'country',data.loaned[i].country);

	if(typeof data.paid !== [{}])
		for(i = 0; i < data.paid.length; i++)
			if(data.paid[i])
				if(data.paid[i].player == idPlayer) {
					updateLogs("Player " +data.id+" paid you "+data.paid[i].amount);
					credit(data.paid[i].amount);
				}

	PlayerPos = data.position;
	transition(data.id,PlayerPos);
	var nextPlayer = ((data.id+1)%nbJoueurs);


	updateUpgrades(data.upgraded);

	$("#btnFinTour").attr('disabled' , true);

	if (nextPlayer != idPlayer) {
		$("#btnDes").attr('disabled' , true);
		$("#btnUpgrade").attr('disabled' , true);
		$("#btnFinTour").attr('disabled' , true);
		$("#btnBuy").attr('disabled' , true);
	} else {

		$("#btnDes").attr('disabled' , false);

		myTurn = true;
		waiting = false;
		getMyInfos();
	}

}


