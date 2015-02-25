////////////////////////////
//        SOCKETS         //
////////////////////////////

module.exports = function(server) {

	var io = require('socket.io')(server);
	//io.set("origins","*");

	var nsp = io.of('/subscribe');

	nsp.on('connection', function(socket){

		console.log('someone connected');

		// HANDSHAKING
		socket.on('handshake',function(data){
			socket.join(data);
			console.log('user joined the room '+data);
		});

		socket.broadcast.to(1).emit('test', "YOLO");

	});
}