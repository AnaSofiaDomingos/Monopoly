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

//idPlayer optional
function credit(value, idPlayer){
	//If "idPlayer" is not specified, we credit our own account
	if(idPlayer == undefined){
		sentJson.account += value;
	}else{
		//Else we put it in the "paid" field of the json
		sentJson.paid[idPlayer].amount = value;
	}
}
