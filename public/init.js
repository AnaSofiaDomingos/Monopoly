// States
var S_DEAD   = -1;
var S_ALIVE  = 0;
var S_JAILED = 1;
var S_PUBLIC = 2;
var S_NO_INT = 3;
var S_NO_WAT = 4;
var S_NO_ELE = 5;

// Upgrades
var UP_WAT = 1;
var UP_ELE = 2;
var UP_INT = 3;
var UP_NUC = 4;

// Constants
var SALARY    = 0.5;
var TAXES     = 0.05;
var CARDS     = 20; // King Burgonde not implemented (id 21)

// Variables
var jail_time   = 0;
var debuff_time = -1;
var buff_time   = -1;
var waiting     = false;
var nbTotalPlayer;

var GameID = localStorage.getItem("idPartie");
var idGlobal = localStorage.getItem("idGlobal");
var idPlayer;
var sentJson;
var nbJoueurs;

var owns   = [];
var backup = [];
var joueurs = [0, 0, 0, 0, 0];

var domain = "localhost";
var port = "8080";

var localJson = [];
var maxUpgrade = 4;

// console.log(idGlobal);
var data = {
	'RoomID'  : GameID,
	'idGlobal' : idGlobal
};

var nbCase = 36;
var countries, cards;
var replays = false;

function updateLogs(log){
	var liElem = '<li class="data-infopays">';
	var liElemClose = '</li>';
	$('#logs-list').append(liElem + log + liElemClose);
	var height = $('#logs').prop('scrollHeight');
	$('#logs').scrollTop(height);
}

