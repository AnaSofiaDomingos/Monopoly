function finTour(GameID, idCurrentPlayer) {

	var tmp = document.getElementById("btnFinTour").disabled = true;
	tmp = document.getElementById("btnDes").disabled = true;

	// Send data
	socket.emit('endofturn',sentJson);
	resetSentJson();
}

function upgrade(idCurrentPlayer){

	var idPays = joueurs[idCurrentPlayer];

	for (var pays in payspossede){
		if(payspossede[pays].idPays == idPays){
			// upgrade of the country
			sentJson.upgraded.push({
				'land' : idPays,
				'level' : ++payspossede[pays].etatAmelioration
			});

		}
	}

	updateUpgrades(sample.upgraded);

	var etatAmeliorationCurrent = payspossede.
	sample.upgraded = {}
}

function updateUpgrades(data){


	$('#case'+data.Land).children('span.upgrade').remove(); // removes all the upgrades in the country
	if(data.hasOwnProperty('level')) // if a land has been upgraded
		for (var y = 0; y < data.level; y++)
			$('#case'+i).append('<span class="upgrade"></span>');
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
        delete obj[c];
    }
}

function receiveData(data) {
	console.log(localJson);
	console.log(data);

	// update list of bought countries
	if(typeof data.bought !== [{}])
		localJson[data.id].owns.push(data.bought);

	// update list of sold countries
	if(typeof data.sold !== [{}])
		for(var i = 0; i < data.sold.length; i++)
			removeItem(countries.owns,'country',data.sold[i].country);

	// update list of cards countries
	if(typeof data.drew !== [{}])
		localJson[data.id].cards.push(data.drew);

	// update list of bought countries
	if(typeof data.used !== [{}])
		for(i = 0; i < data.used.length; i++)
			removeItem(countries.results,'card',data.used[i].card);

	// update list of level of countries countries
	if(typeof data.upgraded !== [{}])
		for (i = 0; i < localJson[data.id].owns.length; i++)
			for (var y = 0; y < data.upgraded.length; y++)
				if(localJson[data.id].owns[i].country == data.upgraded[y].country)
					localJson[data.id].owns[i].level = data.upgraded[y].level;

	// update list of cards countries
	if(typeof data.loaned !== [{}])
		if(!data.loaned[i].recovered)
			localJson[data.id].loans.push(data.loaned);

	// update list of bought countries
	if(typeof data.loaned !== [{}])
		for(i = 0; i < data.loaned.length; i++)
			if(data.loaned[i].recovered)
				removeItem(data.loaned,'country',data.loaned[i].country);

	console.log(localJson);



	localJson[data.id]
	PlayerPos = data.position;
	transition(data.id,PlayerPos);
	var nextPlayer = ((data.id+1)%nbJoueurs);

	var upgraded = data.upgraded;

	updateUpgrades(upgraded);

	console.log("data player "+data.id+" and next is "+nextPlayer+" and i m "+idPlayer);
	if(nextPlayer != idPlayer) {
		var tmp = document.getElementById("btnFinTour").disabled = true;
		tmp = document.getElementById("btnDes").disabled = true;
	} else {
		var tmp = document.getElementById("btnFinTour").disabled = false;
		tmp = document.getElementById("btnDes").disabled = false;
	}

}

