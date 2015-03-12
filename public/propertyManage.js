function buy(idCountry){
	if(!isThisCountryYours(idCountry)){
		connection.query('SELECT Prix FROM pays WHERE idPays = '+country, function(err, rows, fields) 			{		
			if(debit(rows[0].Prix) == 0){
				localJson[idPlayer].owns.push({country: idCountry, level: 0});
				return true;
			}else{
				//User hasn't enough money to buy this country
				return false;
			}
		}
	}else{
		//User already owns the country
		return false;
	}
}

function sell(idCountry){
	if(isThisCountryYours(idCountry)){
		if(!isLoaned(idCountry)){
			connection.query('SELECT Prix FROM pays WHERE idPays = '+country, function(err, rows, fields){
				//We get back 80% of the inital price
				credit(rows[0].Prix*0.8);
				//Delete country in owns array
				for(var i=0; i<localJson[idPlayer].owns.lenght; i++){
					if(localJson[idPlayer].owns[i].country == idCountry)
						localJson[idPlayer].owns.splice(i, 1); //Deletes entry
				}
			}
		}else{
			//Country is loanded, can't sell it
			return false;
		}
	}else{
		//Not user's country
		return false;
	}
}

//Hypothèquer, en français
function mortgage(idCountry){
	if(isThisCoutryYours(idCountry)){
		//Get lvl of the country owned
		var lvl = -1;
		var idOwns = -1;
		for(var i=0; i<localJson[idPlayer].owns.lenght; i++){
			if(localJson[idPlayer].owns[i].country == idCountry)
				idOwns = i;
				lvl = localJson[idPlayer].owns[i].level;
		}

		//If there's no upgrade we can mortgage it
		if(lvl == 0){
			localJson[idPlayer].owns.splice(idOwns, 1);
			localJson[idPlayer].loans.push({country: idCountry});
		}else{
			//Country must be downgraded to be mortgaged
			return false;
		}
	}else{
		//Not user's country
		return false;
	}
}

function isThisCountryYours(idCountry){
	for(var i=0; i<localJson[idPlayer].owns.length){
		if(localJson[idPlayer].owns[i].country == idCountry)
			return true;
	}

	return false;
}

function isLoaned(idCountry){
	for(var i=0; i<localJson[idPlayer].loans.length){
		if(localJson[idPlayer].loans[i].country == idCountry)
			return true;
	}

	return false;
}
