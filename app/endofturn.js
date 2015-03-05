module.exports = function(sentJson, connection) {

	var i;
	var id = sentJson.id;
	var country = -1;

	// Achat pays
	for (i = 0; i < sentJson.bought.length; i++) {
		var bought = sentJson.bought[i];
		if (bought.country != "") {
			// DataBase
			connection.query('INSERT INTO possedepays VALUES ('+id+', ( SELECT idPays FROM pays WHERE NomPays="'+bought.country+'" ), 0, 0)', function(err, rows, fields) {
				if (err) throw err;
				console.log("Player "+id+" bought "+bought.country);
			});
			// localJson
			connection.query('SELECT idPays FROM pays WHERE NomPays="'+bought.country+'"', function(err, rows, fields) {
				if (err) throw err;
				else {
					country = rows[0].idPays;
					if (country != -1)
						localJson[sentJson.id].owns.push({
							"country" : country,
							"level"   : 0
						});
				}			
			}
		}
	}
	
	// Amélioration pays
	for (i = 0; i < sentJson.upgraded.length; i++) {
		var upgraded = sentJson.upgraded[i];
		if (upgraded.country != "") {
			// DataBase
			connection.query('UPDATE possedepays SET etatAmelioration='+upgraded.level+' WHERE idJoueur='+id+' AND idPays = ( SELECT idPays FROM pays WHERE NomPays="'+upgraded.country+'" )', function(err, rows, fields) {
				if (err) throw err;
				console.log("Player "+id+" upgraded "+upgraded.country+" to level "+upgraded.level);
			});
			// localJson
			connection.query('SELECT idPays FROM pays WHERE NomPays="'+upgraded.country+'"', function(err, rows, fields) {
				if (err) throw err;
				else {
					country = rows[0].idPays;
					if (country != -1)
						for (j = 0; j < localJson.owns.length; j++)
							if (localJson.owns[j].country == country) localJson.owns[j].level = sentJson.upgraded[i].level;
				}			
			}
		}
	}

	// Vente pays
	for (i = 0; i < sentJson.sold.length; i++) {
		var sold = sentJson.sold[i];
		if (sold.country != "") {
			// DataBase
			connection.query('DELETE FROM possedepays WHERE idJoueur='+id+' AND idPays = ( SELECT idPays FROM pays WHERE NomPays="'+sold.country+'" )', function(err, rows, fields) {
				if (err) throw err;
				console.log("Player "+id+" sold "+sold.country);
			});
			// localJson
			connection.query('SELECT idPays FROM pays WHERE NomPays="'+sold.country+'"', function(err, rows, fields) {
				if (err) throw err;
				else {
					country = rows[0].idPays;
					if (country != -1)
						for (j = 0; j < localJson.owns.length; j++)
							if (localJson.owns[j].country == country) localJson.owns.splice(j, 1);
				}
			});
		}
	}
	
	// Hypothèque pays
	for (i = 0; i < sentJson.loaned.length; i++) {
		var loaned = sentJson.loaned[i];
		if (loaned.country != "") {
			// DataBase
			connection.query('UPDATE possedepays SET etatHypotheque=1 WHERE idJoueur='+id+' AND idPays = ( SELECT idPays FROM pays WHERE NomPays="'+loaned.country+'" )', function(err, rows, fields) {
				if (err) throw err;
				console.log("Player "+id+" loaned "+loaned.country);
			});
			// localJson
			connection.query('SELECT idPays FROM pays WHERE NomPays="'+loaned.country+'"', function(err, rows, fields) {
				if (err) throw err;
				else {
					country = rows[0].idPays;
					if (country != -1)
						for (j = 0; j < localJson.owns.length; j++)
							if (localJson.owns[i].country == country) {
								localJson.owns.splice(j, 1);
								localJson.loans.push({
									'country' : country
								});
							}
				}
			});
		}
	}
	
	// Pioche carte
	for (i = 0; i < sentJson.drew.length; i++) {
		var keep = false;
		var drew = sentJson.drew[i];
		if (drew.card > 0) {
			// DataBase
			connection.query('SELECT garder FROM cartes WHERE idCarte='+drew.card, function(err, rows, fields) {
				if (err) throw err;
				keep = rows[0].garder;
			});
			if (keep) {
				// DataBase
				connection.query('INSERT INTO possedecarte VALUES ('+drew.card+', '+id+')', function(err, rows, fields) {
					if (err) throw err;
					console.log("Player "+id+" stored the card "+drew.card);
				});
				// localJson
				localJson.cards.push({ 
					'card' : drew.card
				});
			}
			else console.log("Player "+id+" drew the card "+drew.card);
		}
	}
	
	// Mise à jour position
	var position = sentJson.position;
	if (position >= 0)
		connection.query('UPDATE joueurs SET position='+position+' WHERE idJoueur='+id, function(err, rows, fields) {
			if (err) throw err;
			console.log("Player "+id+" is at position "+position);
		});

	// Mise à jour solde
	var account = sentJson.account;
	connection.query('UPDATE joueurs SET solde='+account+' WHERE idJoueur='+id, function(err, rows, fields) {
		if (err) throw err;
		console.log("Player "+id+" has "+account+" left");
	});

}