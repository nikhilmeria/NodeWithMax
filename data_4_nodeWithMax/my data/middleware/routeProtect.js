module.exports = (req, resp, next) => {
	if (!req.session.isLoggedIn) {
		resp.redirect('/login');
	} else {
		next();
	}
};
