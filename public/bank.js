var sample = {};
function debit(value){
	sample.account += value;
}

function credit(idPlayer, value){
	if(sample.paid[idPlayer].amount-value >= 0){
		sample.paid[idPlayer].amount = value;
		return 0;
	}else{
		return (sample.paid[idPlayer].amount-value);
	}
}
