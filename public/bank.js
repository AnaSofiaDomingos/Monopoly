// Debits a player (if possible)
function debit(value){
	//If player has enough money
	if(sentJson.account-value >= 0){
		sentJson.account -= value;
		getMyInfos();
		return 0;
	}else{
		//Else we return the amount of money needed
		return (sentJson.account-value);
	}
}

// Debits a player or out of the game
function debitObligatoire(sum) {
	$('#btnBuy').attr('disabled', 'disabled');
	$('#btnFinTour').attr('disabled', 'disabled');
	$('#btnSell').attr('disabled', 'disabled');
	$('#btnUpgrade').attr('disabled', 'disabled');

	if (sentJson.account < sum)
		if((propertiesValue()+sentJson.account) > sum) {
			$('#dialog').show();
			proposeVente(sum);
		} else
			gameOver();

	getMyInfos();
	return 0;

}

function propertiesValue(){
	var sum=0;
	if(localJson[idPlayer].owns[0].country){
		for(var i=0; i<localJson[idPlayer].owns.length; i++){
			sum += getCountryById(localJson[idPlayer].owns[i].country).Prix;
		}
	}

	return sum;
}

function proposeVente(sum){
	if(localJson[idPlayer].owns[0].country){
		for(var i=0; i<localJson[idPlayer].owns.length; i++){
			var idCountry = localJson[idPlayer].owns[i].country;
			var country = getCountryById(idCountry);
			$('#listSell').append('<br /><input type="checkbox" onClick="setDiff('+sum+')" name="country" value="'+country.idPays+'" /> '+country.NomPays+' <br />');		
		}

		$('#listSell').append('Amount <span id="diff"></span>');
		$('#listSell').append('<br/><input type="button" id="btnSellAll" onclick="sellMultipleCountries(); debit('+sum+')" value="Sell"/>');

		//Center div vertically
		var heightDiv = $('#listSell').height();
		var heightWindow = $(window).height();
		var calc = ((heightWindow/2)-(heightDiv/2)); 			
		$('#listSell').css({ 'top': calc});
	
		$('#dialog').show();
		setDiff(sum); //Shows money needed, based on the amount you got
	}
}

function setDiff(amountMoney){
	var allValues = [];
	$('#dialog :checked').each(function(){
			allValues.push($(this).val())
		});

	var sumCountries = 0;
	for(var i=0; i<allValues.length; i++){
		sumCountries += getCountryById(allValues[i]).Prix;
	}

	$('#diff').text(sentJson.account+sumCountries-amountMoney);

	if((sentJson.account+sumCountries-amountMoney) >= 0){
		$('#btnSellAll').removeAttr("disabled");
	}else{
		$('#btnSellAll').attr("disabled", "disabled");
	}
}

function sellMultipleCountries(sumToDebit){
	var allValues = [];
	$('#dialog :checked').each(function(){
			allValues.push($(this).val())
		});

	for(var i=0; i<allValues.length; i++){
		sell(allValues[i]);
	}

	$('#dialog').hide();
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
		updateLogs("Player "+idPlayer+" got a country robbed");
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
	
	updateLogs("Player "+idPlayer+" robbed a country from player "+victimID);
	
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
	var country = findCountry(posLocal);
	var idPays = country.idPays;	

	if(!idPays) 
		return -1;

	var diff = sentJson.account-country.Prix;
	
	// Checks if the country can be bought
	var valid = false;
	for (var i = 0; i < countries.length; i++) {
		if (posLocal == countries[i].Position)
			valid = true;
		if (valid) break;
	}

	if(diff > 0) {
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
			// To prevent from sell/upgrade/loan for 1 turn
			debit(country.Prix)
			waiting = true;
			$("#btnBuy").hide();
			getMyInfos();
			getInfos(posLocal);

			updateLogs("Player " + idPlayer + " bought " + country.NomPays);	
			return 0;
			
		}else {
			updateLogs("You can't buy" + country.NomPays);	
		}
	} else {
		updateLogs("You don't have enough money ("+diff+")");
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

		updateLogs("Player "+idPlayer+" sold country "+idCountry);
		getMyInfos();
		$("#btnSell").hide();
		$("#btnLoan").hide();
		$("#btnUpgrade").hide();
	} else {
		updateLogs("You can't sell this country, you little hacker");
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
		
		updateLogs("Player "+idPlayer+" loaned "+idCountry);
		getMyInfos();
		getInfos(-1,idCountry);
	} else {
		updateLogs("You can't loan this country, you little hacker");
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

		removeItem(localJson[idPlayer].loans,'country',idCountry);

		getMyInfos();
		getInfos(-1,idCountry);
		
		return 0;
		
	}
	else {
	
		updateLogs("Vous avez besoin de "+diff+" pour terminer cette action");
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
