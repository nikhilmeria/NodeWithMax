const express = require('express');
const router = express.Router();

const shopCntrl = require('../controller/shop');

router.get('/', shopCntrl.getIndex);
router.get('/products', shopCntrl.getProducts);
router.get('/products/:productId', shopCntrl.getProduct);
router.get('/cart', shopCntrl.getCart);
router.post('/cart', shopCntrl.postCart);
router.get('/orders', shopCntrl.getOrders);
router.get('/checkout', shopCntrl.getCheckout);

module.exports = router;
