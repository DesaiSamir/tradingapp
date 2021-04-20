var mysql = require('mysql2');
const { conn_str } = require('./config');

var connection = mysql.createConnection(conn_str);

connection.connect(function(err) {
	if (err) throw err;
	console.log('Database is connected successfully !');
});

const getData = async function(query) {
	try {
		const result = await connection.promise().query(query);
		if(result[0].length > 0){
			return result[0];
		}
		return null;
	} catch (error) {
		console.log({query, error});
	}
};

const crudData = async function(query, object) {
	try {
		const result = await connection.promise().query(query);
		if(result[0].affectedRows > 0){
			object.insertId = result[0].insertId;
			// console.log({object, result:result[0]});
			return object;
		}
		return null;
	} catch (error) {
		console.log({object, query, error});
	}
};

module.exports = connection;
module.exports.getData = getData;
module.exports.crudData = crudData;