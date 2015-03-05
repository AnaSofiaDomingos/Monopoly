function applyCard() {

	switch(idCard) {
		case 1 : 			// Kim Jung pirate notre banque
			debitObligatoire(1);
		break;
		case 2 :
			// Plus internet 2 tours
			
		break;
		case 3 :
			debitObligatoire(0.2);
		break;
		case 4 :
			// debit 100'000 par pays
			for(var i = 0; i<localJson.countries.length; i++)
				debitObligatoire(0.1);
		break;
		case 5 :
			// Plus eau 2 tours
		break;
		case 6 :
			debitObligatoire(0.5);
		break;
		case 7 :
			// Viol sur mineur
			debitObligatoire(2);
			var idCredit = (idPlayer-1)%nbJoueurs;
			credit(idCredit, 2);
		break;
		case 8 :
			// 1er pays d'asie plus d'eau 2 tours
		break;
		case 9 :
			// USA saisissent les ameliorations Moyen-Orient
		break;
		case 10 :
			// Plus d'electricite pendant 1 tour, europe 2 tours
		break;

	}

	return localJson;

}

function debitObligatoire(sum) {
	while(localJson.account < sum)
		if(localJson.countries.length > 0) 	
			localJson.account += proposeVente();
		else {
			localJson.dead = 0;
			console.log("Dead "+localJson.id);
			return -1
		}

	debit(sum);
	console.log("Debit "+sum);
	return 0;
}

