module.exports = function(sample, mysql) {

	var id = sample.id;

	var connection = mysql.createConnection({
		host     : '129.194.185.13',
		user     : 'monopoly',
		password : 'Super2008',
		database : 'monopoly'
	});


	connection.connect();

	// Achat pays
	var bought = sample.bought;
	if (bought.land != "")
		connection.query('INSERT INTO possedepays VALUES ('+id+', ( SELECT idPays FROM pays WHERE NomPays="'+bought.land+'" ), 0, 0)', function(err, rows, fields) {
			if (err) throw err;
			console.log("Player "+id+" bought "+bought.land);
		});

	// Amélioration pays
	var upgraded = sample.upgraded;
	if (upgraded.land != "")
		connection.query('UPDATE possedepays SET etatAmelioration='+upgraded.level+' WHERE idJoueur='+id+' AND idPays = ( SELECT idPays FROM pays WHERE NomPays="'+upgraded.land+'" )', function(err, rows, fields) {
			if (err) throw err;
			console.log("Player "+id+" upgraded "+upgraded.land+" to level "+upgraded.level);
		});

	// Vente pays
	var sold = sample.sold;
	if (sold.land != "")
		connection.query('DELETE FROM possedepays WHERE idJoueur='+id+' AND idPays = ( SELECT idPays FROM pays WHERE NomPays="'+sold.land+'" )', function(err, rows, fields) {
			if (err) throw err;
			console.log("Player "+id+" sold "+sold.land);
		});

	// Hypothèque pays
	var loaned = sample.loaned;
	if (loaned.land != "")
		connection.query('UPDATE possedepays SET etatHypotheque=1 WHERE idJoueur='+id+' AND idPays = ( SELECT idPays FROM pays WHERE NomPays="'+loaned.land+'" )', function(err, rows, fields) {
			if (err) throw err;
			console.log("Player "+id+" loaned "+loaned.land);
		});

	// Pioche carte
	var keep = false;
	var drew = sample.drew;
	if (drew.card >= 0) {
		connection.query('SELECT garder FROM cartes WHERE idCarte='+drew.card, function(err, rows, fields) {
			if (err) throw err;
			keep = rows[0].solution;
		});
		if (keep)
			connection.query('INSERT INTO possedecarte VALUES ('+drew.card+', '+id+')', function(err, rows, fields) {
				if (err) throw err;
				console.log("Player "+id+" stored the card "+drew.card);
			});
		else console.log("Player "+id+" drew the card "+drew.card);
	}

	// Mise à jour position
	var position = sample.position;
	if (position >= 0)
		connection.query('UPDATE joueurs SET position='+position+' WHERE idJoueur='+id, function(err, rows, fields) {
			if (err) throw err;
			console.log("Player "+id+" is at position "+position);
		});

	// Mise à jour solde
	var account = sample.account;
	connection.query('UPDATE joueurs SET solde='+account+' WHERE idJoueur='+id, function(err, rows, fields) {
		if (err) throw err;
		console.log("Player "+id+" has "+account+" left");
	});

	connection.end();

}