
var socket = io('http://localhost:8080/account');

function register() {
	// Verify passwords
	var pass1 = $('#password1').val();
	var pass2 = $('#password2').val();
	var login = $('#loginRegister').val();
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
				$('#errorsRegister').text("Login empty");
	} else {
		$('#errorsRegister').text("Passwords not matching");
	}
}

function login() {

}
