////////////////////////////
//        ROUTING         //
////////////////////////////

module.exports = function(app, mysql) {

	// -------------------------------------------------------------------------
	// -------------------------------------------------------------------------
	// ---------------------------------- API ----------------------------------
	// -------------------------------------------------------------------------
	// -------------------------------------------------------------------------

	// -----------------
	// URI : /
	// method : GET
	// Date : 18.02.2015
	// -----------------

	app.get("/", function (req, res) {
		res.redirect("/index.html");
	});
	
	// -----------------
	// URI : /fintour
	// method : PUT
	// Date : 19.02.2015
	// -----------------

	app.get("/fintour", function (req, res) {
	
		//var sample = req.body;
		
		var sample = {

  "id": "1",
  
  "bought": {
	"land": "France"
  },
  
  "upgraded": {
	"land": "Qatar",
	"level": "2"
  },
  
  "sold": {
    "land": "Italy"
  },
  
  "loaned": {
    "land": "Switzerland"
  },

  "drew": {
    "card": "21"
  },
  
  "account": "201500",
  
  "position": "21"
  
};
		// end of turn==================================================================
		require('./endofturn.js')(sample, mysql);
		res.redirect("/index.html");
	});
}