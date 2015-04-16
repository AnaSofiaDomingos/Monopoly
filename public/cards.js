	
function tirerCarte() {

	var card = 0;
	while ((card == 0) || (card == 19) || (card == 21))
			card = Math.floor((Math.random() * CARDS));

	sentJson.drew.push({'card' : card});
	updateLogs("Vous avez tiré la carte "+card + " : " + getCardById(card).Contenu);
	
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
				updateLogs("Vous avez perdu 1'000'000");
			else 
				gameOver();
			break;
			
		case 2 :
			if (localJson[idPlayer].owns.length > 1){
				// Plus internet 2 tours (back to electricity)
				for (var i = 0; i < localJson[idPlayer].owns.length; i++) {
				
					// Backup the state
					backup.push(localJson[idPlayer].owns[i]);
					if (localJson[idPlayer].owns[i].level >= UP_INT)
						grade(localJson[idPlayer].owns[i].country, UP_ELE);	
					debuff_time = 2;
					
				}
				updateLogs("Vous n'avez plus Internet pendant 2 tours");
			}else
				updateLogs("La carte ne peut être appliquée (chanceux !)");
			break;
			
		case 3 : 
		
			// Debit 200 000 aux taxes
			sum = 0.2;
			if (debitObligatoire(sum) == 0) 
				updateLogs("Vous avez payé 200'000 de taxes");
			else 
				gameOver();
			break;
			
		case 4 :
			
			// Debit 100'000 par pays
			if (localJson[idPlayer].owns.length > 0){
				for (var i = 0; i < localJson[idPlayer].owns.length; i++) {
					sum = 0.1 ;
					if (debitObligatoire(sum) == 0) 
						updateLogs("Vous avez payé 100'000");
					else 
						gameOver();
				}
			}else
				updateLogs("La carte ne peut être appliquée (chanceux !)");
			break;
			
		case 5 :
			
			// Plus eau 2 tours (amélioration niveau 0)
			if (localJson[idPlayer].owns.length > 0){
				for (var i = 0; i < localJson[idPlayer].owns.length; i++) {
					
					// Backup state
					backup.push(localJson[idPlayer].owns[i]);
					grade(localJson[idPlayer].owns[i].country, 0);
					debuff_time = 2;
					
				}
				updateLogs("Vous n'avez plus d'Eau pendant 2 tours");
			}else
				updateLogs("La carte ne peut être appliquée (chanceux !)");
			break;
			
		case 6 : 
		
			// Debit 500 000 
			sum = 0.5;
			if (debitObligatoire(sum) == 0) 
				updateLogs("Vous avez payé 500'000");
			else 
				gameOver();
			break;
			
		case 7 :
		
			// Viol sur mineur => debit 2 000 000
			sum = 2;
			if (debitObligatoire(sum) == 0) 
				updateLogs("Vous avez payé 2'000'000");
			else 
				gameOver();

			var idCredit = (idPlayer + 1) % nbJoueurs;
			credit(2, idCredit);
			updateLogs("Le joueur "+idCredit+" les reçoit");


			// prison
			goToJail(idPlayer);
			break;
			
		case 8 :
		
			// Roi Burgonde installé en Asie plus d'eau 2 tours (amélioration 0)
			if (localJson[idPlayer].owns.length > 0){
				for (var i = 0; i < localJson[idPlayer].owns.length; i++) {
					if(localJson[idPlayer].owns[i]){
						// Backup state
						backup.push(localJson[idPlayer].owns[i]);
						// bug when player haven't got any country in asia
						// Date : 26.03.2015 !!
						if (countries[localJson[idPlayer].owns[i].country].Continent.equals("Asie"))
							grade(localJson[idPlayer].owns[i].country, 0);
						debuff_time = 2;
					}
				}
				updateLogs("Vous n'avez plus d'Eau en Asie pendant 2 tours");
			}else
				updateLogs("La carte ne peut être appliquée (chanceux !)");
			break;
		
		case 9 :
			// USA saisissent les ameliorations Moyen-Orient
			if (localJson[idPlayer].owns.length > 0) {
				var paysAleatoire = Math.floor(Math.random() * localJson[idPlayer].owns.length);
				grade(localJson[idPlayer].owns[paysAleatoire].country, 0);
				updateLogs("Les USA saisissent vos améliorations à " + localJson[idPlayer].owns[paysAleatoire].country);
				updateUpgrades(sentJson.upgraded);
			}else
				updateLogs("La carte ne peut être appliquée (chanceux !)");
			break;
			
		case 10 :
			
			// Plus d'electricite pendant 2 tours
			if (localJson[idPlayer].owns.length > 0) {
				for (var i = 0; i < localJson[idPlayer].owns.length; i++){
				
					// Backup the state
					backup.push(localJson[idPlayer].owns[i]);
					if (localJson[idPlayer].owns[i].level >= UP_ELE)
						grade(localJson[idPlayer].owns[i].country, UP_WAT);	
					debuff_time = 2;
					
				}
				updateLogs("Vous n'avez plus d'Électricité en Asie pendant 2 tours");
			}else
				updateLogs("La carte ne peut être appliquée (chanceux !)");
			break;


		case 11 : 
		
			// Debite 500 000 (Arthur Pendragon)
			sum = 0.5;
			if (debitObligatoire(sum) == 0) 
				updateLogs("Vous avez payé 500'000");
			else 
				gameOver();
			break;
					  
		case 12 : 
		
			// Labo de meth not found => credit de 1 000 000 
 			sum = 1;
			if (credit(sum) == 0) 
				updateLogs("Vous avez reçu 1'000'000");
			break;
				  
		case 13 : // garder
			if (localJson[idPlayer].owns.length > 0) {
				// Internet gratuit dans un pays
				updateLogs("Vous obtenez gratuitement Internet dans un pays");
				removeItem(localJson[idPlayer].cards, "card", 13);
				var country = localJson[idPlayer].owns[Math.floor(Math.random() * localJson[idPlayer].owns.length)].country;
				grade(country, UP_INT);
			}else
				updateLogs("La carte ne peut être utilisée !");
			break;
				  
		case 14 :  // garder
		
			// Envahir pays de qualité inférieur si on paye 10 000 000
			if (sentJson.position > 1) {
				var	country = Math.ceil(Math.random() * sentJson.position) + 1;		
				if (debit(10) == 0) {
					updateLogs("Vous envahissez " + country);
					inherit(country);
					for (var i = 0; i < localJson[idPlayer].cards.length; i++)
						if (localJson[idPlayer].cards[i].card == country)
							localJson[idPlayer].cards.splice(i, 1);

					removeItem(localJson[idPlayer].cards, "card", 14);
					getMyInfos();
				}else
					updateLogs("Vous n'avez pas assez d'argent");
			}
			break;
				  
		case 15 :  // garder
			if (sentJson.state == S_ALIVE)
				updateLogs("La carte ne peut être utilisée !");
			else{
				// Sortie prison
				if (sentJson.state == S_JAILED)
					sentJson.state = S_ALIVE;
				updateLogs("Vous êtes sorti de prison");
				removeItem(localJson[idPlayer].cards, "card", 15);
			}
			break;
		
		case 16 : 
		
			// Découverte puit vente pétrole 2 000 000
			sum = 2;
			if (credit(sum) == 0) updateLogs("Vous avec reçu 2'000'000");
			break;
				  
		case 17 : 
		
			// Gain de 1 000 000
			sum = 1;
			if (credit(sum) == 0) 
				updateLogs("Vous avez reçu 1'000'000");
			break;
				  
		case 18 : 
		
			// Rejouer
			updateLogs("Vous rejouez");
			replay();
			break;
				  
		case 19 : 
		
			// Debit 500 000 pour pub mais on recuperer 200 000 pdt 5 tours
			sum = 0.5;
			if (debitObligatoire(sum) == 0) {
				updateLogs("Vous avez payé 500'000");
				localJson.state = S_PUBLIC;
				credit(0.2);
				updateLogs("Vous avez reçu 200'000");
				buff_time = 5;
			}
			else gameOver();
			break;
				  
		case 20 : 
		
			// EMS en feu
			sum = 0.3;
			if (credit(sum) == 0) 
				updateLogs("Vous avez reçu 300'000");
			break;
				  
		case 21 : 
		
			// Burgonde King
			updateLogs("Vous avez tiré le Roi Burgonde !");
			break;

	}
}