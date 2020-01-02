//Connecting to mongoDB Atlas directly without using mongoDB server on pc and using default mongoDB driver (not mongoose)
const mongoDB = require('mongodb');
const MongoClient = mongoDB.MongoClient;

let dbClient = null;

const client = cbFn => {
	return MongoClient.connect(
		'mongodb+srv://nikhil:goolluu@ecomproj-ono9g.mongodb.net/Shop?retryWrites=true&w=majority',
		{ useNewUrlParser: true }
	)
		.then(client => {
			dbClient = client.db();
			cbFn(client);
		})
		.catch(err => console.log(err));
};

const getDB = () => {
	if (dbClient) {
		return dbClient;
	} else {
		throw 'No Database avaliable !!!';
	}
};

exports.client = client;
exports.getDB = getDB;
