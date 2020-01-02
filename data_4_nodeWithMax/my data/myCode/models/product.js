const path = require('path');
const fs = require('fs');

const myPath = path.join(
	path.dirname(process.mainModule.filename),
	'data',
	'products.json'
);

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		console.log('In save Fn :');
		fs.readFile(myPath, (err, fileContent) => {
			if (err) {
				console.log('fetchAll err');
				return;
			} else if (this.id) {
				console.log('Existing product save', JSON.parse(fileContent));
				let existingProducts = [];
				existingProducts.push(...JSON.parse(fileContent));
				console.log('existingProducts :', existingProducts);
				let updatedProduct = existingProducts.findIndex(
					existingProd => existingProd.id === this.id
				);
				existingProducts[updatedProduct] = this;
				console.log('updatedProduct :', existingProducts);
				fs.writeFile(myPath, JSON.stringify(existingProducts), err => {
					console.log(err);
				});
			} else {
				console.log('New product save');
				this.id = Math.random().toString();
				let products = [];
				fs.readFile(myPath, (err, fileContent) => {
					console.log('File :', err);
					if (!err) {
						products = JSON.parse(fileContent);
						console.log('prod1 :', products);
					}
					products.push(this);
					fs.writeFile(myPath, JSON.stringify(products), err =>
						console.log('write err :', err)
					);
				});
			}
		});
	}

	static fetchAll(cbFn) {
		fs.readFile(myPath, (err, fileContent) => {
			if (err) {
				console.log('fetchAll err');
				cbFn([]);
			}
			console.log('fetchAll done !!!');
			cbFn(JSON.parse(fileContent));
		});
	}

	static findById(id, cbFn) {
		console.log('In findByID FN');
		let products = [];
		fs.readFile(myPath, (err, fileContent) => {
			if (err) {
				console.log('fetchAll err');
				return;
			} else {
				products = JSON.parse(fileContent);
				console.log('fetchAll done !!! :');
				const prodWithId = products.find(product => product.id === id);
				cbFn(prodWithId);
			}
		});
	}
};
