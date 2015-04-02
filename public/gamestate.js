function terminateGame(){
	if(nbJoueurs == 1){ // game is over and will be terminated
		if(sentJson.state != S_DEAD)
			alert("Bravo vous avez gagné !");
		window.location.href = 'http://'  + domain + ':' + port + "/index.html";
	}
}

function gameOver() {

	console.log("Player " + idPlayer + " out of the game");
	localJson[idPlayer].owns = [];
	localJson[idPlayer].loans = [];
	localJson[idPlayer].cards = [];
	nbJoueurs--;

	sentJson.state = S_DEAD;

	finTour();
	terminateGame();

	return -1;

}