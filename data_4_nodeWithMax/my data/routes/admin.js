const express = require('express');

const adminController = require('../controllers/admin');
const routeProtect = require('../middleware/routeProtect');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', routeProtect, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', routeProtect, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', routeProtect, adminController.postAddProduct);

router.get(
	'/edit-product/:productId',
	routeProtect,
	adminController.getEditProduct
);

router.post('/edit-product', routeProtect, adminController.postEditProduct);

router.post('/delete-product', routeProtect, adminController.postDeleteProduct);

module.exports = router;
