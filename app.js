var express = require('express');
var app = express();
var port = 3000;
// requiring mysql module
var mysql = require('mysql');
// body-parser module allows to parse a post request
var bodyParser = require('body-parser');
var chart = require('chart.js');

// setting our app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));
// ejs module allows embedding of js in html code
// setting ejs to work with our app
app.set('view engine', 'ejs');
// sets 'public' folder to be accessible by our app (ejs file)
app.use(express.static(__dirname + "/public"))

// Connecting to existing database
var connection = mysql.createConnection({
	host	:	'<DB host name here>',
	user	:	'<DB user name here>',
	database:	'spending',
	password:	'<DB user password here>',
	multipleStatements: true
});

// creating a response to opening app home page
// shows data for the last month
app.get('/', (req, res) => {
	var q = "SELECT name FROM persons;"+ 
	"SELECT name FROM categories;"+ 
	"SELECT amount FROM spendings WHERE made_at > (SELECT NOW() - INTERVAL 1 MONTH);"+ 
	"SELECT name, SUM(amount) AS sum FROM spendings JOIN categories ON categories.id = spendings.cat_id WHERE made_at > (SELECT NOW() - INTERVAL 1 MONTH) GROUP BY cat_id;"+ 
	"SELECT name, SUM(amount) AS sum FROM spendings JOIN persons ON persons.id = spendings.person_id WHERE made_at > (SELECT NOW() - INTERVAL 1 MONTH) GROUP BY person_id;";
	connection.query(q, function(err, results) {
		if (err) throw err;
		var pers_list = results[0];
		var cat_list = results[1];
		var spend_list = results[2];
		var lab_cat = [];
		var lab_pers = [];
		var dat_cat = [];
		var dat_pers = [];
		for (i = 0; i < results[4].length; i++) {
			lab_pers.push(results[4][i].name);
		};
		for (i = 0; i < results[3].length; i++) {
			lab_cat.push(results[3][i].name);
		};
		for (i = 0; i < results[3].length; i++) {
			dat_cat.push(results[3][i].sum);
		};
		for (i = 0; i < results[4].length; i++) {
			dat_pers.push(results[4][i].sum);
		};
		res.render('home_month', {spend_list: spend_list, cat_list: cat_list, pers_list: pers_list, lab_pers: lab_pers, lab_cat: lab_cat, dat_cat: dat_cat, dat_pers: dat_pers});
	});
});

// response to setting range to 'Whole time'
app.get('/total', (req, res) => {
	var q = "SELECT name FROM persons;"+ 
	"SELECT name FROM categories;"+ 
	"SELECT amount FROM spendings;"+ 
	"SELECT SUM(amount) AS sum FROM spendings JOIN categories ON categories.id = spendings.cat_id GROUP BY cat_id;"+ 
	"SELECT SUM(amount) AS sum FROM spendings JOIN persons ON persons.id = spendings.person_id GROUP BY person_id;";
	connection.query(q, function(err, results) {
		if (err) throw err;
		var pers_list = results[0];
		var cat_list = results[1];
		var spend_list = results[2];
		var lab_cat = [];
		var lab_pers = [];
		var dat_cat = [];
		var dat_pers = [];
		for (i = 0; i < results[0].length; i++) {
			lab_pers.push(results[0][i].name);
		};
		for (i = 0; i < results[1].length; i++) {
			lab_cat.push(results[1][i].name);
		};
		for (i = 0; i < results[3].length; i++) {
			dat_cat.push(results[3][i].sum);
		};
		for (i = 0; i < results[4].length; i++) {
			dat_pers.push(results[4][i].sum);
		};
		res.render('home_total', {spend_list: spend_list, cat_list: cat_list, pers_list: pers_list, lab_pers: lab_pers, lab_cat: lab_cat, dat_cat: dat_cat, dat_pers: dat_pers});
	});
});

app.post('/add', (req, res) => {
	if (req.body.pers === undefined || req.body.cat === undefined) {
		console.log('Person and/or category undefined');
		res.redirect('/');
	} else {
		connection.query('SELECT id FROM persons WHERE name = ?', req.body.pers, function(error, results) {
			if (error) throw error;
			var person_id = results[0].id;

		connection.query('SELECT id FROM categories WHERE name = ?', req.body.cat, function(error, results) {
			if (error) throw error;
			var cat_id = results[0].id;

		var spending = { 
			person_id: person_id,
			cat_id: cat_id,
			amount: req.body.amount
		};
		connection.query('INSERT INTO spendings SET ?', spending, function(error, results) {
			if (error) throw error;
			// redirects back to the home page
			res.redirect('/');
		console.log('Spending < ' + req.body.pers + ', ' + req.body.cat + ', ' + parseFloat(req.body.amount).toFixed(2) + ' > posted to /add');
		}); }); }); 
	};
});

// app waits for connection on this address and port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});