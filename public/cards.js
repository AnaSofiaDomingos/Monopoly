function tirerCarte() {

	var card = 0;
	while ((card == 0) || (card == 2) || (card == 5) ||
	       (card == 8) || (card == 10) || (card == 19) || (card == 21))
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

	var backup = [{}];
	var sum;
	var nbTour;
	
	switch(idCard) {
	
		case 1 : // Kim Jung pirate notre banque
		
			sum = 1;
			if (debitObligatoire(sum) == 0) 
				console.log("Player "+idPlayer+" paid 200'000");
			else 
				gameOver();
			break;
			
		case 2 :
		
			// Plus internet 2 tours
			for(var i = 0; i<localJson.owns.length; i++){
				console.log("Player "+id+" have no internet for each country during 2 turn");
				backup.push(localJson.owns[i]);
				localJson.owns[i].level = 2;
				grade(localJson.owns[i].country, localJson.owns[i].level);
				sentJson.state = S_NO_INT;  // no internet
				nbTour = 2;
			}
			break;
			
		case 3 : // debit 200 000 aux taxes
		
			sum = 0.2;
			if (debitObligatoire(sum) == 0) 
				console.log("Player "+idPlayer+" paid 200'000");
			else 
				gameOver();
			break;
			
		case 4 :
		
			// debit 100'000 par pays
			for(var i = 0; i<localJson[idPlayer].owns.length; i++){
				sum = 0.1 ;
				if (debitObligatoire(sum) == 0) 
					console.log("Player "+idPlayer+" paid 100'000");
				else 
					gameOver();
			}
			break;
			
		case 5 :
		
			// Plus eau 2 tours
			for(var i = 0; i<localJson[idPlayer].owns.length; i++){
				console.log("Player "+idPlayer+" have no water for each country during 2 turn");
				backup.push(localJson[idPlayer].owns[i]);
				localJson[idPlayer].owns[i].level = 0;
				grade(localJson[idPlayer].owns[i].country, localJson[idPlayer].owns[i].level);
				sentJson.state = S_NO_WAT;  // no water
				nbtour = 2;
			}
			break;
			
		case 6 : // debit 500 000 
		
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
		
			//roi Burgonde installer trompe dans asie plus d'eau 2 tours
			for(var i = 0; i<localJson[idPlayer].owns.length; i++){
				console.log("Player "+idPlayer+" have no water for 2 turn");
				backup.push(localJson[idPlayer].owns[i]);
				localJson[idPlayer].owns[i].level = 0;
				grade(localJson[idPlayer].owns[i].country, localJson[idPlayer].owns[i].level);
				sentJson.state = S_NO_WAT;  // no water
				nbtour = 2;
			}
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
			nbtour = 2;
			for (var i = 0; i < localJson[idPlayer].owns.length; i++){
				localJson[idPlayer].owns[i].level = 0;
				sentJson.upgraded.push({
					'country' : localJson[idPlayer].owns[i].country,
					'level'   : localJson[idPlayer].owns[i].level
				});
				sentJson.state = S_NO_WAT;  // no water
			}
			
			break;


		case 11 : // debite 500 000 (Arthur Pendragon)
		
			sum = 0.5;
			if (debitObligatoire(sum) == 0) 
				console.log("Player "+idPlayer+" paid 500'000");
			else 
				gameOver();
			break;
					  
		case 12 : // labo de meth not found => credit de 1 000 000 
		
 			sum = 1;
			if (credit(sum) == 0) 
				console.log("Player "+idPlayer+" got 1'000'000");
			break;
				  
		case 13 : // internet gratuit dans un pays
		
			console.log("Player "+idPlayer+" can have internet for free");
			grade(country, UP_WAT);
			break;
				  
		case 14 : // Envahir pays de qualité inférieur si on paye 10 000 000
		
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
				  
		case 15 : // carte sortie prison

			if (sentJson.state == S_JAILED)
				sentJson.state = S_ALIVE;
			break;
		
		case 16 : // découverte puit vente pétrole 2 000 000
		
			sum = 2;
			if (credit(sum) == 0) console.log("Player "+id+" got 2'000'000");
			break;
				  
		case 17 : // gain de 1 000 000
		
			sum = 1;
			if (credit(sum) == 0) 
				console.log("Player "+id+" got 1'000'000");
			break;
				  
		case 18 : // rejouer
		
			replay();
			break;
				  
		case 19 : // debit 500 000 pour pub mais on recuperer 200 000 pdt 5 tours
		
			sum = 0.5;
			if (debitObligatoire(sum) == 0) {
				console.log("Player "+id+" paid 500'000 for pub");
				localJson.state = S_PUBLIC;

				credit(0.2);
				console.log("Player "+id+" gained 200'000");
				nbtour = 5;
			}
			else gameOver();
			break;
				  
		case 20 : // EMS en feu
		
			sum = 0.3;
			if (credit(sum) == 0) 
				console.log("Player "+id+" got 300'000");
			break;
				  
		case 21 : // Burgonde King
		
			console.log("Player "+id+" drew the Burgonde King");	
			break;

	}
}