// fonction permettant de construire les cases de chaque pays et carte
function constructionCase(typecase, id, sens, parent ){
	if (sens == 1)
		for (var i = id; i < (id+8); i++)
			$('#'+parent).append("<div id='case" + i + "' class='"+ typecase + "' onclick='getInfos("+i+")' ></div>");
	else
		for (var i = id; i > (id-8); i--)
			$('#'+parent).append("<div id='case" + i + "' class='"+ typecase + "' onclick='getInfos("+i+")'></div>");
}


// affiche les informations de la case apres avoir cliquer dessus
function getInfos(position, pays){
	$('#infosPays').removeClass("empty");
	// empeche le click des cases spéciales
	if (position == 0 | position == 3 | position == 6 | position == 9 | position == 12 | position == 15 |
		position == 18 | position == 21 | position == 24 | position == 27 | position == 30 | position == 33)
		return ;

	var level, owned =false;
	var idpays, country;
	$('#infosPays').empty();


	// si un id pays est donnée en paramètre pas besoin d'aller chercher dans la liste des pays
	if (pays == undefined){
		country = findCountry(position);
		$('#infosPays').append("<h2>" + country.NomPays + "</h2>");
		idpays = country.idPays;

	}else{
		var nom = getById(pays, 'pays');
		$('#infosPays').append("<h2>" + nom + "</h2>");
		idpays = pays;
	}

	// debut de la liste
	$('#infosPays').append("<ul>");

	// affiche le level du pays
	for (var i=0; i<localJson[idPlayer].owns.length;i++){
		if (localJson[idPlayer].owns[i].country == idpays){
			level = true;
			$('#infosPays ul').append("<li class='data-infopays'>lvl " + localJson[idPlayer].owns[i].level + " </li>"); 
		}
	}

	if (level==false)
			$('#infosPays ul').append("<li class='data-infopays'>lvl 0</li>");

	var mine = false; // indicates if the country is mine

	// affiche le propriétaire du pays
	for (var i=0;i<localJson.length;i++){
		for (var j=0; j<localJson[i].owns.length;j++){
			if (localJson[i].owns[j].country == idpays){
				owned = true;
				if(i == idPlayer)
					mine = true;
				$('#infosPays ul').append("<li class='data-infopays'>Propriétaire " + i + "</li>");
			}
		}
	}

	if (owned==false){
		$('#infosPays ul').append("<li class='data-infopays'>Aucun propriétaire</li>");

		// affiche le prix du pays si personne ne l'a acheter
		$('#infosPays ul').append("<li class='data-infopays'>Prix " + country.Prix + " millions</li>");
	}
	$('#infosPays').append("</ul>");

	// affiche les boutons en fonction de la position locale
	currentPlayer = ((sentJson.id)%nbJoueurs);
	if (posLocal == position){
		if (mine && (idPlayer == currentPlayer)){
			$('#infosPays').append('<input id="btnUpgrade" class="third" type="button" value="améliorer" onclick="upgrade('+idPlayer+')" />');
			$('#infosPays').append('<input id="btnSell" class="third" type="button" value="vendre" onclick="sell('+idpays+')" />');
			$('#infosPays').append('<input id="btnLoan" class="third" type="button" value="hypothéquer" onclick="loan('+idpays+')" />');
		}
		else
			$('#infosPays').append('<input id="btnBuy" class="full" type="button" value="Acheter" onclick="buy()" />');
	}else if ((position == -1) && (findCountry(posLocal).idPays == idpays) && mine && (idPlayer == currentPlayer)){
			$('#infosPays').append('<input id="btnUpgrade" class="third" type="button" value="améliorer" onclick="upgrade('+idPlayer+')" />');
			$('#infosPays').append('<input id="btnSell" class="third" type="button" value="vendre" onclick="sell('+idpays+')" />');
			$('#infosPays').append('<input id="btnLoan" class="third" type="button" value="hypothéquer" onclick="loan('+idpays+')" />');

	}else{
		if(mine && (idPlayer == currentPlayer)){
			$('#infosPays').append('<input id="btnSell" class="half" type="button" value="vendre" onclick="sell('+idpays+')" />');
			$('#infosPays').append('<input id="btnLoan" class="half" type="button" value="hypothéquer" onclick="loan('+idpays+')" />');
		}
	}
}

// place le pays dans les div
function placeCountriesCartes(){
	for (var i=0; i<nbCase;i++){
		var country = findCountry(i);
		if (country != undefined)
			$('#case'+ i).append("<span class='case'>"+ country.NomPays +"</span>");
	}

	// taxes
	$('#case3').append("<span class='case'>Taxes</span>");
	$('#case12').append("<span class='case'>Taxes</span>");
	$('#case21').append("<span class='case'>Taxes</span>");
	$('#case30').append("<span class='case'>Taxes</span>");

	// cartes
	$('#case6').append("<span class='case'>Carte</span>");
	$('#case15').append("<span class='case'>Carte</span>");
	$('#case24').append("<span class='case'>Carte</span>");
	$('#case33').append("<span class='case'>Carte</span>");

	// coins
	$('#case0').append("<span class='case'>Depart</span>");
	$('#case9').append("<span class='case'>Prison</span>");
	$('#case18').append("<span class='case'>Parking</span>");
	$('#case27').append("<span class='case'>Aller Prison</span>");
}

// trouve le pays correspondant à la case avec la position
function findCountry(id){
	for (var i=0; i< countries.length;i++){
		if (countries[i].Position == id)
			return countries[i];

	}
}

/*  retrouve le nom du pays en fonction de l'id si table = pays
	retrouve le contenu de la carte en fonction de l'ip si table = cartes*/
function getById(id, table){
	if (table == 'pays'){
		for (var i=0; i< countries.length; i++){
			if (countries[i].idPays == id)
				return countries[i].NomPays;
		}
	}

	/*else if (table == 'carte') {
		for (var i=0; i< carte.length; i++){

		}
	}*/

}

function getCountryById(id) {
	for (var i=0; i< countries.length; i++){
			if (countries[i].idPays == id)
				return countries[i];
		}
}


// recupere les information en fonction d'un id
function getMyInfos(){
	$("#pays").empty();
	$('#pays').append('<li class="titre-infopays capitalize">pays</li>');
	$("#cartes").empty();
	$('#cartes').append('<li class="titre-infopays capitalize">cartes</li>');
	$("#credit").empty();


	// liste les owns
	for (var i=0; i < localJson[idPlayer].owns.length; i++){
		var nom = getById(localJson[idPlayer].owns[i].country, 'pays');
		if (nom)
			$('#pays').append("<li class='data-infopays' onclick='getInfos(-1,"+ localJson[idPlayer].owns[i].country+")' >" + nom + "</li>");
	}

	// liste les loans
	for (var i=0; i < localJson[idPlayer].loans.length; i++){
		if (localJson[idPlayer].loans[i].country  != undefined){
			var nom = getById(localJson[idPlayer].loans[i].country, 'pays');
			$('#pays').append("<li class='data-infopays hypotheque'>" + nom + "</li>");
		}
	}

	// liste le cartes
	for (var i=0; i < localJson[idPlayer].cards.length; i++)
		if (localJson[idPlayer].cards[i].card  != undefined)
			$('#cartes').append("<li class='data-infopays'>" + localJson[idPlayer].cards[i].card + "</li>");



	$('#credit').append(sentJson.account.toFixed(4)+"M");

}