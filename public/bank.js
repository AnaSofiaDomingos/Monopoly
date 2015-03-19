// Debits a player (if possible)
function debit(value){
	//If player has enough money
	if(sentJson.account-value >= 0){
		sentJson.account -= value;
		return 0;
	}else{
		//Else we return the amount of money needed
		return (sentJson.account-value);
	}
}

// Debits a player or out of the game
function debitObligatoire(sum) {

	while (localJson.account < sum) 
		if (localJson.countries.length > 0) localJson.account += proposeVente();
		else return gameOver();
		
	debit(sum);
	return 0;

}

// Credits a player
function credit(value, idPlayer){
	//If "idPlayer" is not specified, we credit our own account
	if(idPlayer == undefined){
		sentJson.account += value;
	}else{
		//Else we put it in the "paid" field of the json
		// sentJson.paid.amount = value;
		sentJson.paid.push({
			'amount' : value,
			'player' : idPlayer
		});
	}
}

// Desherit a country
function desherit(sample) {

	if (sample.victimID == idPlayer) {
		removeItem(localJson[idPlayer].owns, 'country', country);
		console.log("Player "+idPlayer+" got a country robbed");
	}
	
	return 0;
			
}

// Inherit a country
function inherit(country) {

	var victimID;

	for (var i = 0; i < localJson.length; i++) 
		for (var j = 0; j < localJson[i].owns.length; j++)
			if (localJson[i].owns[j].country == country){
				victimID = i;
				break;
			}
	
	localJson[idPlayer].owns.push({
		'country' : country,
		'level'   : 0
	});
	
	var sample = {
		'country' : country,
		'victim'  : victimID,
		'gameID'  : gameID
	};
	
	socket.emit('robbed', sample);
	
	console.log("Player "+idPlayer+" robbed a country from player "+victimID);
	
	return 0;

}



function gameOver() {

	window.alert("Player "+id+" out of the game");
	localJson[idPlayer].owns = [{}];
	localJson[idPlayer].loans = [{}];
	localJson[idPlayer].cards = [{}];

	sentJson.state = -1;
	return -1;
	
}

function buy() {
	// Checks if the player can afford the country
	var idPays = findCountry(posLocal).idPays;
	
	if(!idPays) 
		return -1;

	var diff = debit(countries[idPays].Prix);
	
	// Checks if the country can be bought
	var valid = false;
	for (var i = 0; i < countries.length; i++) {
		if (posLocal == countries[i].Position)
			valid = true;
		if (valid) break;
	}

	if(diff == 0) {
		// Checks if country isn't already bought
		for(var i = 0; i<localJson.length; i++) {
			for(var j = 0; j<localJson[i].owns.length;j++) {
				if(localJson[i].owns[j].country) {
					var c = getCountryById(localJson[i].owns[j].country); 
					if(c.Position == posLocal) {
						valid = false;
						break;
					}
				}
			}
		}
		
		if (valid) {
		
			localJson[idPlayer].owns.push({
				'country' : idPays,
				'level'   : 0
			});
			
			sentJson.bought.push({
				'country' : idPays
			});
			console.log(" -- sentJSON --");
			console.log(sentJson.bought);
			$("#btnBuy").hide();
			getMyInfos();
			return 0;
			
		}else {
			console.log("You can't buy this country");	
		}
	} else {
		console.log("You don't have enough money ("+diff+")");
		return 1;
	}
}

function sell(idCountry) {

	var valid = checkActionAvailable(idCountry);


	if(valid) {
		removeItem(localJson[idPlayer].owns, 'country', idCountry);

		sentJson.sold.push({
			'country' : idCountry
		});

		credit(countries[idCountry - 1].Prix); //

		console.log("Player "+idPlayer+" sold country "+idCountry);
		getMyInfos();
		$(".btnSell").hide();
		$(".btnLoan").hide();
	} else {
		console.log("You can't sell this country, you little hacker");
	}

}

function loan(idCountry) {

	var valid = checkActionAvailable(idCountry);

	if(valid) {
		removeItem(localJson[idPlayer].owns, 'country', idCountry);
		localJson[idPlayer].loans.push({
			'country' : idCountry
		});
		sentJson.loaned.push({
			'country'   : idCountry,
			'recovered' : 0
		});

		credit(countries[idCountry - 1].Prix);
		
		console.log("Player "+idPlayer+" loaned "+idCountry);
		getMyInfos();
	} else {
		console.log("You can't loan this country, you little hacker");
	}

}

function recover(idCountry) {

	var diff = debit(countries[posLocal].Prix);
	
	if (diff == 0) {
	
		localJson[idPlayer].owns.push({
			'country' : idCountry,
			'level'   : 0
		});
		
		sentJson.loaned.push({
			'country'   : idCountry,
			'recovered' : 1
		});
		
		return 0;
		
	}
	else {
	
		console.log("Vous avez besoin de "+diff+" pour terminer cette action");
		return 1;
		
	}

}

function checkActionAvailable(id) {
	for(var j = 0; j<localJson[sentJson.id].owns.length;j++) {
		if(localJson[sentJson.id].owns[j].country) {
			var c = getCountryById(localJson[sentJson.id].owns[j].country); 
			if(c.idPays == id) {
				return true;
			}
		}
	}
	return false;
}
