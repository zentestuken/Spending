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
	run();
});

// Finds out min and max ids for persons and categories and uses it to generate spendings table

function run() {
	q = 'SELECT MAX(id) AS pmax, MIN(id) AS pmin, (SELECT MAX(id) FROM categories) AS cmax, (SELECT MIN(id) FROM categories) AS cmin FROM persons';
	connection.query(q, function(error, maxmin) {
		console.log(error);
		console.log(maxmin);
		generate_spendings(maxmin);
		insert_spendings(data);
		connection.end();
	});
};

function generate_spendings(arg) {
	var start_date = '2021-01-01';
	var today = new Date().toISOString().slice(0, 10);
	var pid_max = arg[0].pmax;
	var pid_min = arg[0].pmin;
	var cid_max = arg[0].cmax;
	var cid_min = arg[0].cmin;
	data = [];
	
	for(var i = 0; i < 60; i++) {
		data.push(
			[rand_value(pid_max, pid_min), rand_value(cid_max, cid_min), rand_value(100, 1, 1), faker.date.between(start_date, today)]
		);
	};

	for(var i = 0; i < 10; i++) {
		data.push(
			[rand_value(pid_max, pid_min), rand_value(cid_max, cid_min), rand_value(1000, 1, 1), faker.date.between(start_date, today)]
		);
	};

	for(var i = 0; i < 2; i++) {
		data.push(
			[rand_value(pid_max, pid_min), rand_value(cid_max, cid_min), rand_value(10000, 1, 1), faker.date.between(start_date, today)]
		);
	};
	
	console.log(data);
};

function rand_value(arg1, arg2, param) {
	if (param == null) {
		return Math.floor((Math.random() * (arg1+1-arg2)) + arg2);
	} else { 
		return (Math.random() * (arg1-arg2) + arg2).toFixed(2);
	};
};

function insert_spendings(args) {
	q = 'INSERT INTO spendings (person_id, cat_id, amount, made_at) VALUES ?';

	connection.query(q, [args], function(error, result) {
		console.log(error);
	});
};