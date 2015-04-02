var socket = io('http://localhost:8080/salon');

function createGame(){
	socket.emit('whoami', , infosConnect.pseudo);
	var nbplayers = $('#nbPlayers').val();
	socket.emit('createGame', nbplayers);
}

function salon(){

}