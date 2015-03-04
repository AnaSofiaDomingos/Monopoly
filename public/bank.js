module.exports = function(sample, connection) {
	function debit(idPlayer, value){
		sample.paid[idPlayer].amount = value;
	}

	function credit(value){
		sample.account += value;
		return 0;
	}
}
