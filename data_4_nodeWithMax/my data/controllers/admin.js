const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		isAuthenticated: req.session.isLoggedIn
	});
};

exports.postAddProduct = (req, resp, next) => {
	console.log('postAddProduct req :', req.session.user);
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	const product = new Product({
		title: title,
		imageUrl: imageUrl,
		description: description,
		price: price,
		userId: req.user
	});
	product
		.save() // inbuilt fn in mongoose, without mongoose we created it
		.then(result => {
			console.log('Product created :', result);
			resp.redirect('/products');
		})
		.catch(err => console.log('Product creation err: ', err));
};

exports.getEditProduct = (req, res, next) => {
	console.log('Product editing ');
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then(product => {
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product
			});
		})
		.catch(err => console.log('Product editing err: ', err));
};

exports.postEditProduct = (req, res, next) => {
	console.log('In postEditProduct');
	const updatedTitle = req.body.title;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDesc = req.body.description;
	const updatedPrice = req.body.price;
	const id = req.body.productId;

	Product.findById(id)
		.then(product => {
			if (product.userId.toString() !== req.user._id.toString()) {
				return res.redirect('/');
			}
			console.log('Updated Product found :');
			product.title = updatedTitle;
			product.imageUrl = updatedImageUrl;
			product.description = updatedDesc;
			product.price = updatedPrice;

			product
				.save()
				.then(result => {
					console.log('Edited Product saved :', result);
					res.redirect('/products');
				})
				.catch(err => console.log('Edited Product err: ', err));
		})
		.catch(err => console.log('err Updating Product : ', err));
};

exports.getProducts = (req, res, next) => {
	console.log('Inside Admin getProducts:');
	Product.find({ userId: req.user._id })
		//	.populate('userId') // 1
		.then(products => {
			console.log('Admin getProducts:', products);
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products'
			});
		})
		.catch(err => console.log('Shop db err :', err));
};

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.deleteOne({ _id: prodId, userId: req.user._id })
		.then(() => res.redirect('/admin/products'))
		.catch(err => console.log('Product Delete err :', err));
};

//1. to fetch all or indiviual field data from collection used to establish relation.
