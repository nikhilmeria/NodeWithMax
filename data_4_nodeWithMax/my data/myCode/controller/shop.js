const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, resp, next) => {
	console.log('In Shop');
	Product.fetchAll(product => {
		//	console.log('get Product in Shop  :', product);
		//	resp.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
		resp.render('shop/product-list', {
			prods: product,
			pageTitle: 'Shop- EJS',
			path: '/products'
		}); //1
	});
};

exports.getProduct = (req, resp, next) => {
	const prodId = req.params.productId; //2
	console.log('id :', prodId);
	Product.findById(prodId, prodWithId => {
		console.log('Found & Done :', prodWithId.id);
		resp.render('shop/product-detail', {
			product: prodWithId,
			path: '/product',
			pageTitle: prodWithId.title
		});
	});
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll(product => {
		res.render('shop/index', {
			prods: product,
			pageTitle: 'Shop',
			path: '/'
		});
	});
};

exports.getCart = (req, res, next) => {
	res.render('shop/cart', {
		path: '/cart',
		pageTitle: 'Your Cart'
	});
};

exports.postCart = (req, resp, next) => {
	const pId = req.body.productId;
	console.log('from Post cart :', pId);
	Product.findById(pId, prodWithId => {
		Cart.addProduct2Cart(pId, prodWithId.price);
	});
	resp.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Order'
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
};

//1. for passing a dynamic content (variables) to the '.ejs' file we use a object. But its is not passed as an object but indiviual keys are passed as variables.

//2. 'req.param' will gv access to dynamic content passed in the route.
