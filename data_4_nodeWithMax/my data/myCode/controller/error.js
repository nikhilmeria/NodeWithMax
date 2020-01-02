exports.errPage = (req, resp, next) => {
	console.log('Err Page');
	resp.status(404).render('error', { pageTitle: 'Error Page - EJS' });
	//	resp.status(404).sendFile(path.join(__dirname, 'views', 'error.html'));
};
