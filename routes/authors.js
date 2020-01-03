const express = require('express');
const Author = require('../models/author');
const router = express.Router();

// get All Authors Route
router.get('/', async (req, resp) => {
	try {
		const authors = await Author.find();
		resp.render('authors/index', {
			pageTitle: 'All Authors',
			authors: authors
		});
	} catch (err) {
		console.log(err);
		resp.render('/', {
			pageTitle: 'MyApp',
			errMess: 'Error fetching data, try again'
		});
	}
});

// New Author Route
router.get('/new', (req, resp) => {
	resp.render('authors/new', {
		pageTitle: 'New Author',
		author: new Author()
	});
});

// Create Author Route
router.post('/', async (req, resp) => {
	console.log('author name =>', req.body);
	const author = new Author({
		name: req.body.name
	});

	try {
		const newAuthorCreatedInDb = await author.save();
		resp.redirect('authors');
	} catch {
		resp.render('authors/new', {
			pageTitle: 'New Author',
			author: author,
			errMess: 'Error creating author, try again'
		});
	}
});

module.exports = router;
