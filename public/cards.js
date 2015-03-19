function tirerCarte() {

	var card = 0;
	while ((card == 0) || (card == 19) || (card == 21))
			card = Math.floor((Math.random() * CARDS));

	sentJson.drew.push({'card' : card});
	console.log("Player "+idPlayer+" drew card "+card);
	
	if (cards[card-1].Garder) {
		localJson[idPlayer].cards.push({'card' : card});
		getMyInfos();
	}
	else
		applyCard(card);

}

function applyCard(idCard) {

	var sum;
	
	switch(idCard) {
	
		case 1 : 
		
			// Kim Jung pirate notre banque
			sum = 1;
			if (debitObligatoire(sum) == 0) 
				console.log("Player "+idPlayer+" paid 200'000");
			else 
				gameOver();
			break;
			
		case 2 :
		
			// Plus internet 2 tours (back to electricity)
			for (var i = 0; i < localJson[idPlayer].owns.length; i++) {
			
				// Backup the state
				backup.push(localJson[idPlayer].owns[i]);
				if (localJson[idPlayer].owns[i].level >= UP_INT)
					grade(localJson[idPlayer].owns[i].country, UP_ELE);	
				debuff_time = 2;
				
			}
			console.log("Player "+idPlayer+" has no internet for 2 turn");
			break;
			
		case 3 : 
		
			// Debit 200 000 aux taxes
			sum = 0.2;
			if (debitObligatoire(sum) == 0) 
				console.log("Player "+idPlayer+" paid 200'000");
			else 
				gameOver();
			break;
			
		case 4 :
		
			// Debit 100'000 par pays
			for (var i = 0; i < localJson[idPlayer].owns.length; i++) {
				sum = 0.1 ;
				if (debitObligatoire(sum) == 0) 
					console.log("Player "+idPlayer+" paid 100'000");
				else 
					gameOver();
			}
			break;
			
		case 5 :
		
			// Plus eau 2 tours (amélioration niveau 0)
			for (var i = 0; i < localJson[idPlayer].owns.length; i++) {
				
				// Backup state
				backup.push(localJson[idPlayer].owns[i]);
				grade(localJson[idPlayer].owns[i].country, 0);
				debuff_time = 2;
				
			}
			console.log("Player "+idPlayer+" has no water for 2 turn");
			break;
			
		case 6 : 
		
			// Debit 500 000 
			sum = 0.5;
			if (debitObligatoire(sum) == 0) 
				console.log("Player "+idPlayer+" paid 500'000");
			else 
				gameOver();
			break;
			
		case 7 :
		
			// Viol sur mineur => debit 2 000 000
			sum = 2;
			if (debitObligatoire(sum) == 0) 
				console.log("Player "+idPlayer+" paid 2 000'000");
			else 
				gameOver();

			var idCredit = (idPlayer - 1 + nbJoueurs) % nbJoueurs;
			credit(idCredit, 2);
			console.log("Player "+idCredit+" got'em");
			break;
			
		case 8 :
		
			// Roi Burgonde installé en Asie plus d'eau 2 tours (amélioration 0)
			for (var i = 0; i < localJson[idPlayer].owns.length; i++) {
			
				// Backup state
				backup.push(localJson[idPlayer].owns[i]);
				if (countries[localJson[idPlayer].owns[i].country].Continent.equals("Asie"))
					grade(localJson[idPlayer].owns[i].country, 0);
				debuff_time = 2;
				
			}
			console.log("Player "+idPlayer+" has no water in Asia for 2 turn");
			break;
		
		case 9 :
		
			// USA saisissent les ameliorations Moyen-Orient
			console.log("Player "+idPlayer+" have no more levels for a random country");
			if (localJson[idPlayer].owns.length > 0) {
				var paysAleatoire = Math.floor(Math.random() * localJson[idPlayer].owns.length);
				grade(localJson[idPlayer].owns[paysAleatoire].country, 0);
				console.log("Country "+localJson[idPlayer].owns[paysAleatoire].country+" got robbed by the USA");
			}
			break;
			
		case 10 :
		
			// Plus d'electricite pendant 2 tours
			for (var i = 0; i < localJson[idPlayer].owns.length; i++){
			
				// Backup the state
				backup.push(localJson[idPlayer].owns[i]);
				if (localJson[idPlayer].owns[i].level >= UP_ELE)
					grade(localJson[idPlayer].owns[i].country, UP_WAT);	
				debuff_time = 2;
				
			}
			console.log("Player "+idPlayer+" has no electricity for 2 turns");
			break;


		case 11 : 
		
			// Debite 500 000 (Arthur Pendragon)
			sum = 0.5;
			if (debitObligatoire(sum) == 0) 
				console.log("Player "+idPlayer+" paid 500'000");
			else 
				gameOver();
			break;
					  
		case 12 : 
		
			// Labo de meth not found => credit de 1 000 000 
 			sum = 1;
			if (credit(sum) == 0) 
				console.log("Player "+idPlayer+" got 1'000'000");
			break;
				  
		case 13 : 
		
			// Internet gratuit dans un pays
			console.log("Player "+idPlayer+" can have internet for free");
			grade(country, UP_INT);
			break;
				  
		case 14 : 
		
			// Envahir pays de qualité inférieur si on paye 10 000 000
			if (sentJson.position > 1) {
				var	country = Math.ceil(Math.random() * sentJson.position) + 1;		
				console.log("Player "+idPlayer+" invades country "+country);
				if (debit(10) == 0) {
					inherit(country);
					for (var i = 0; i < localJson[idPlayer].cards.length; i++)
						if (localJson[idPlayer].cards[i].card == country)
							localJson[idPlayer].cards.splice(i, 1);
				}
			}
			break;
				  
		case 15 : 

			// Sortie prison
			if (sentJson.state == S_JAILED)
				sentJson.state = S_ALIVE;
			break;
		
		case 16 : 
		
			// Découverte puit vente pétrole 2 000 000
			sum = 2;
			if (credit(sum) == 0) console.log("Player "+id+" got 2'000'000");
			break;
				  
		case 17 : 
		
			// Gain de 1 000 000
			sum = 1;
			if (credit(sum) == 0) 
				console.log("Player "+id+" got 1'000'000");
			break;
				  
		case 18 : 
		
			// Rejouer
			replay();
			break;
				  
		case 19 : 
		
			// Debit 500 000 pour pub mais on recuperer 200 000 pdt 5 tours
			sum = 0.5;
			if (debitObligatoire(sum) == 0) {
				console.log("Player "+id+" paid 500'000 for pub");
				localJson.state = S_PUBLIC;
				credit(0.2);
				console.log("Player "+id+" gained 200'000");
				buff_time = 5;
			}
			else gameOver();
			break;
				  
		case 20 : 
		
			// EMS en feu
			sum = 0.3;
			if (credit(sum) == 0) 
				console.log("Player "+id+" got 300'000");
			break;
				  
		case 21 : 
		
			// Burgonde King
			console.log("Player "+id+" drew the Burgonde King");	
			break;

	}
}