function createGame(){
	var nbplayers = $('#nbPlayers').val();
	socket.emit('createGame', nbplayers);
}