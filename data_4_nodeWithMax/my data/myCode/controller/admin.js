const Product = require('../models/product');

exports.getAddProduct = (req, resp, next) => {
	console.log('In add Product');
	//resp.sendFile(path.join(__dirname, '../', 'views', 'addProduct.html'));
	resp.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		edit: false
	});
	//next();
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products'
		});
	});
};

exports.postAddProduct = (req, resp, next) => {
	console.log('Body :', req.body);
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product(null, title, imageUrl, description, price);
	console.log('Product :', product.title);
	product.save();
	resp.redirect('/');
	//next();
};

exports.getEditProduct = (req, resp, next) => {
	console.log('In Edit Product');
	const editQuery = req.query.edit; //1
	const delQuery = req.query.delete; //1
	console.log(`edit: ${editQuery} && delete: ${delQuery}`);

	// Delete Section
	if (delQuery === 'true') {
		console.log('query value 2 :', delQuery);
		const prodId = req.params.productId;
		Product.findById(prodId, prodWithId => {
			if (!prodWithId) {
				return resp.redirect('/');
			}
			resp.render('admin/edit-product', {
				pageTitle: 'Delete Product',
				path: '/admin/edit-product',
				product: prodWithId,
				edit: delQuery
			});
		});
	}

	// Edit Section
	const prodId = req.params.productId;
	Product.findById(prodId, prodWithId => {
		if (!prodWithId) {
			return resp.redirect('/');
		}
		resp.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			edit: editQuery,
			product: prodWithId
		});
	});
};

exports.postEditProduct = (req, resp, next) => {
	console.log('In Post Product', req.query);
	console.log('Page title', req.body.pageTitle);
	console.log('postEditProduct :', req.body.productId);
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDesc = req.body.description;
	const updatedProduct = new Product(
		prodId,
		updatedTitle,
		updatedImageUrl,
		updatedPrice,
		updatedDesc
	);
	updatedProduct.save();
	resp.redirect('/admin/products');
};

//1. 'query' params used here. chk 'edit-product.ejs' file to see how to pass query parameters.
