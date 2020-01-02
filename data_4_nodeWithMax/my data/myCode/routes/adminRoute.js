const express = require('express');
const router = express.Router();

const adminCntrl = require('../controller/admin');

router.get('/add-product', adminCntrl.getAddProduct);
router.get('/products', adminCntrl.getProducts);
router.post('/add-product', adminCntrl.postAddProduct);
router.get('/edit-product/:productId', adminCntrl.getEditProduct);
router.post('/edit-product', adminCntrl.postEditProduct);

module.exports = router;
