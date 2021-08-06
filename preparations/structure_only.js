var mysql = require('mysql');
var faker = require('faker');

var connection = mysql.createConnection({
	host	:	'localhost',
	user	:	'root',
	database:	'spending'
});

// Populates persons and categories tables
var data = [ ['Yauhen'], ['Katsiaryna'], ['Pusheen the Cat'] ];

q = 'INSERT INTO persons (name) VALUES ?';

connection.query(q, [data], function(error, result) {
	console.log(error);
});

data = [
		['Food'], 
		['Housing'], 
		['Transport'],
		['Fees'],
		['Purchases'],
		['Other'],
	];

q = 'INSERT INTO categories (name) VALUES ?';

connection.query(q, [data], function(error, result) {
	console.log(error);
});

connection.end();