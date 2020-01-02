const express = require('express');

const shopController = require('../controllers/shop');
const routeProtect = require('../middleware/routeProtect');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', routeProtect, shopController.getProduct);

router.get('/cart', routeProtect, shopController.getCart);

router.post('/cart', routeProtect, shopController.postCart);

router.post(
	'/cart-delete-item',
	routeProtect,
	shopController.postCartDeleteProduct
);

router.post('/create-order', routeProtect, shopController.postOrder);

router.get('/orders', routeProtect, shopController.getOrders);

module.exports = router;
