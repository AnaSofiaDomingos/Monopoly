
var socket = io('http://localhost:8080/account');

var infosConnect;

function register() {
	// Verify passwords
	var pass1 = $('#password1').val();
	var pass2 = $('#password2').val();
	var login = $('#loginRegister').val();

	$('#errorsRegister').css("color", "red");

	if(pass1 == pass2) {
		if(login) {
			if(pass1) {
				// Send login to server
				socket.emit('register', {'login':login, 'pass':pass1});

				socket.on('loginExists', function(exists){
					if(exists)
						$('#errorsRegister').text("Login already exists");
					else {
						$('#errorsRegister').css("color", "green");
						$('#errorsRegister').text("Account created");
					}
				});
			} else 
				$('#errorsRegister').text("Password empty");
		} else
				$('#errorsRegister').text("Pseudo empty");
	} else {
		$('#errorsRegister').text("Passwords not matching");
	}
}

function login() {
	var pseudo = $('#pseudoLogin').val();
	var pass = $.md5($('#passLogin').val());
	$('#errorsLogin').css("color", "red");
	if(pseudo && pass) {
		socket.emit('login', {'login':pseudo, 'pass':pass});

		socket.on('loginSuccess', function(success){
			if(success) {
				infosConnect = success;
				$('#errorsLogin').css("color", "green");
				$('#errorsLogin').text("Login success");
				$('#login, #register').hide();
				$('#pseudoTitle').text(infosConnect.pseudo);
				$('#accInfos').show();
				$('#pseudoLogin').val("");
				$('#passLogin').val("");
				$('#saloon').show();
				salon();
			} else {
				$('#errorsLogin').text("Login failed");
			}
		});
	}else{
		$('#errorsLogin').text("passowrd or login empty");
	}
	
}

function logout() {
	$('#accInfos').hide();
	$('#register').show();
	$('#login').show();
	infosConnect = {};
}


