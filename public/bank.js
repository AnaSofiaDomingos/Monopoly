function debit(value){
	localJson.account += value;
}

function credit(idPlayer, value){
	if(localJson.paid[idPlayer].amount-value >= 0){
		localJson.paid[idPlayer].amount = value;
		return 0;
	}else{
		return (localJson.paid[idPlayer].amount-value);
	}
}
