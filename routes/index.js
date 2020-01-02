const express = require('express');
const router = express.Router();

router.get('/', (req, resp) =>
	resp.render('index', {
		pageTitle: 'MyApp'
	})
);

module.exports = router;
