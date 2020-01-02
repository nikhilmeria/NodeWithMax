/* Using Mongoose */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	imageUrl: {
		type: String,
		required: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

module.exports = mongoose.model('Product', productSchema);

//
//
//
// const mongoDB = require('mongodb');
// const getDB = require('../util/database').getDB;

// class Product {
// 	constructor(title, imageUrl, description, price, id, userId) {
// 		this.title = title;
// 		this.imageUrl = imageUrl;
// 		this.description = description;
// 		this.price = price;
// 		this._id = id ? new mongoDB.ObjectID(id) : null; // 2
// 		this.userId = userId;
// 	}

// 	save() {
// 		if (this._id) {
// 			//edit product
// 			const dbUpdate = getDB();
// 			return dbUpdate
// 				.collection('products')
// 				.updateOne({ _id: this._id }, { $set: this });
// 		} else {
// 			// create new product
// 			const dbSave = getDB();
// 			return dbSave.collection('products').insertOne(this);
// 		}
// 	}

// 	static fetchAll() {
// 		const db = getDB();
// 		return db
// 			.collection('products')
// 			.find()
// 			.toArray()
// 			.then(products => {
// 				console.log('fetchAll products:');
// 				return products;
// 			})
// 			.catch(err => console.log('Shop fetch db err :', err));
// 	}

// 	static findById(id) {
// 		console.log('findById ');
// 		const db = getDB();
// 		return db
// 			.collection('products')
// 			.find({ _id: new mongoDB.ObjectID(id) }) // 1
// 			.next()
// 			.then(product => {
// 				console.log('findById product:');
// 				return product;
// 			})
// 			.catch(err => console.log('findById product err :', err));
// 	}

// 	static deleteById(id) {
// 		console.log('In deleteById');
// 		const db = getDB();
// 		return db
// 			.collection('products')
// 			.deleteOne({ _id: new mongoDB.ObjectID(id) })
// 			.then(product => {
// 				console.log('findById delete product Fn:');
// 				return product;
// 			})
// 			.catch(err => console.log('findById product err :', err));
// 	}
// }

// module.exports = Product;

//1. '_id' created by mongoDb is an object of type 'ObjectId'. chk video 184 for further details @time 6:05. IMP->Not reqd if we use 'mongoose'.

//2. 'id' var is for editing purpose . If a new product is being created than 'this._id=id' will return a null value for 'this._id' bcoz we will nt pass any id to save fn.
