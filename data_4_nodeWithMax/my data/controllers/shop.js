const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, resp, next) => {
	console.log('getProducts :');
	//	Product.fetchAll() //without mongoose, we created
	Product.find() //inbuilt in mongoose
		.then(products => {
			console.log('Shop getProducts  :', products);
			resp.render('shop/product-list', {
				prods: products,
				pageTitle: 'Shop',
				path: '/products'
			});
		})
		.catch(err => console.log('Shop db err :', err));
};

// for indiviual product detail
exports.getProduct = (req, res, next) => {
	console.log('getProduct detail :');
	const prodId = req.params.productId;
	Product.findById(prodId) //'findById' is inbuilt in mongoose
		.then(product => {
			console.log('getProduct in then() :', product);
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products'
			});
		})
		.catch(err => console.log('getProduct err :', err));
};

exports.getIndex = (req, resp, next) => {
	//Product.fetchAll() //without mongoose
	Product.find()
		.then(products => {
			resp.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/'
			});
		})
		.catch(err => console.log('Shop db err :', err));
};

exports.getCart = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			const products = user.cart.items;
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: products
			});
		})
		.catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then(product => {
			return req.user.addToCart(product);
		})
		.then(result => {
			console.log(result);
			res.redirect('/cart');
		});
};

exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.removeFromCart(prodId)
		.then(result => {
			res.redirect('/cart');
		})
		.catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			const products = user.cart.items.map(i => {
				return { quantity: i.quantity, product: { ...i.productId._doc } };
			});
			const order = new Order({
				user: {
					email: req.user.email,
					userId: req.user
				},
				products: products
			});
			return order.save();
		})
		.then(result => {
			return req.user.clearCart();
		})
		.then(() => {
			res.redirect('/orders');
		})
		.catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
	Order.find({ 'user.userId': req.user._id })
		.then(orders => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders
			});
		})
		.catch(err => console.log(err));
};
