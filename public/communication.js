function finTour(GameID, idCurrentPlayer) {

	document.getElementById("btnFinTour").disabled = true;
	document.getElementById("btnDes").disabled = true;

	// Send data
	socket.emit('endofturn',sentJson);
	resetSentJson();
}

function upgrade(idCurrentPlayer){
	var idPays = joueurs[idCurrentPlayer];
	var newLvl = prompt("Quel genre d'amélioration voulez-vous effectuer ?", getUpByCountry(idPays));
	var pays;
	// console.log(countries);

	for(var i = 0; i<countries.length; i++) {
		if(countries[i].Position == idPays) {
			pays = countries[i];
		}
	}

	// console.log(pays);

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
	console.log(price);
	console.log(sentJson.account);
	var r = debit(price);
	if(r == 0)
		window.alert(pays.NomPays + " amelioré !");
	else 
		window.alert("Il manque "+r+" pour acheter "+pays.NomPays);

	console.log(sentJson.account);

	// upgrade of the country
	sentJson.upgraded.push({
		'country' : idPays,
		'level' : newLvl
	});

	for(var i = 0; i<localJson[sentJson.id].owns.length; i++) {
		if(localJson[sentJson.id].owns[i].country == idPays)
			localJson[sentJson.id].owns[i].level = newLvl;
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
		$('#case'+data[i].country).children('span.upgrade').remove(); // removes all the upgrades in the country
		// console.log("level : "+data[i].level);
		for (var y = 0; y < data[i].level; y++) {
			$('#case'+data[i].country).append('<span class="upgrade"></span>');
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
		for (i = 0; i < data.loaned.length; i++)
			if(!data.loaned[i].recovered)
				localJson[data.id].loans.push(data.loaned); 

	// update list of bought countries
	if(typeof data.loaned !== [{}])
		for(i = 0; i < data.loaned.length; i++)
			if(data.loaned[i].recovered)
				removeItem(data.loaned,'country',data.loaned[i].country);

	console.log(localJson);



	// localJson[data.id]
	PlayerPos = data.position;
	transition(data.id,PlayerPos);
	var nextPlayer = ((data.id+1)%nbJoueurs);


	updateUpgrades(data.upgraded);

	console.log("data player "+data.id+" and next is "+nextPlayer+" and i m "+idPlayer);
	
	document.getElementById("btnFinTour").disabled = true;
	if (nextPlayer != idPlayer) {
		document.getElementById("btnDes").disabled = true;
		document.getElementById("btnUpgrade").disabled = true;
		document.getElementById("btnFinTour").disabled = true;
		document.getElementById("btnBuy").disabled = true;
	} else {
		document.getElementById("btnDes").disabled = false;
		document.getElementById("btnFinTour").disabled = false;
	}

}

