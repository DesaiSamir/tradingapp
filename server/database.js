var mysql = require('mysql2');
const { conn_str } = require('./config');

var connection;

function handleDisconnect() {
	connection = mysql.createConnection(conn_str);

	connection.connect(function(err) {
		if(err) {
			console.log('error when connecting to db:', err);
			setTimeout(handleDisconnect, 2000);
		}
		console.log('Database is connected successfully !');
	});

	connection.on('error', function(err) {
		console.log('db error', err);
		if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
			handleDisconnect();
		} else {
			throw err;
		}
	});
}

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


handleDisconnect();
module.exports = connection;
module.exports.getData = getData;
module.exports.crudData = crudData;