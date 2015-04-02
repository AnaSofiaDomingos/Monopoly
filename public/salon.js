function createGame(){
	var socketSalon = io('http://localhost:8080/salon');
	var nbplayers = $('#nbPlayers').val();
	socketSalon.emit('createGame', nbplayers);
}

function salon(){

}