const User = require('../models/users');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

exports.getLogin = (req, resp, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	resp.render('auth/login', {
		pageTitle: 'LOGIN',
		path: '/login',
		isAuthenticated: false,
		errorMessage: message,
		oldInput: {
			email: '',
			password: '',
			confirmPassword: ''
		},
		cssError: []
	});
};

exports.postLogin = (req, resp, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const validationError = validationResult(req);

	if (!validationError.isEmpty()) {
		return res.status(422).render('auth/login', {
			path: '/login',
			pageTitle: 'login',
			errorMessage: validationError.array()[0].msg,
			oldInput: {
				email: email,
				password: password
			},
			cssError: validationError.array() //video no 297.
		});
	}

	User.findOne({ email: email })
		.then(user => {
			console.log('postLogin user:', user);
			if (!user) {
				//	req.flash('error', 'Invalid email or password');
				return res.status(422).render('auth/login', {
					path: '/login',
					pageTitle: 'login',
					errorMessage: 'Invalid email or password',
					oldInput: {
						email: email,
						password: password
					},
					cssError: []
				});
			} else {
				bcrypt
					.compare(password, user.password)
					.then(hashMatched => {
						if (hashMatched) {
							req.session.isLoggedIn = true;
							req.session.user = user; //2
							req.session.save(() => {
								console.log('postLogin save :');
								resp.redirect('/');
							});
						} else {
							console.log(' hash did not match ');
							return res.status(422).render('auth/login', {
								path: '/login',
								pageTitle: 'login',
								errorMessage: 'Invalid email or password',
								oldInput: {
									email: email,
									password: password
								},
								cssError: []
							});
						}
					})
					.catch(err => {
						console.log(' login hash err :', err);
						resp.redirect('/login');
					});
			}
		})
		.catch(err => console.log('User login err :', err));
};

exports.getSignup = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		isAuthenticated: false,
		errorMessage: message,
		oldInput: {
			email: '',
			password: '',
			confirmPassword: ''
		},
		cssError: []
	});
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const validationError = validationResult(req);

	if (!validationError.isEmpty()) {
		console.log('Valid :', validationError.array());
		console.log('data :', email);
		return res.status(422).render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			errorMessage: validationError.array()[0].msg,
			oldInput: {
				email: email,
				password: password,
				confirmPassword: req.body.confirmPassword
			},
			cssError: validationError.array() //video no 296.
		});
	}

	bcrypt
		.hash(password, 12)
		.then(hashedPassword => {
			const user = new User({
				email: email,
				password: hashedPassword,
				cart: {
					items: []
				}
			});
			user
				.save()
				.then(usr => {
					console.log('SignUp usr :', usr);
					res.redirect('/login');
					//Sending email on sign up
					sgMail.setApiKey(
						'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'
					);
					const msg = {
						to: 'klokroom@gmail.com',
						from: 'test@nodeApp.com',
						subject: 'Sending with Twilio SendGrid is Fun',
						text: 'and easy to do anywhere, even with Node.js',
						html: '<strong>and easy to do anywhere, even with Node.js</strong>'
					};
					sgMail.send(msg);
					console.log('Mail Sent');
				})
				.catch(err => console.log('SignUp err :', err));
		})
		.catch(err => console.log('Hash password creation err :', err));
};

exports.postLogout = (req, resp, next) => {
	req.session.destroy(err => {
		console.log('Session destroy err :', err);
		resp.redirect('/');
	});
};

exports.getReset = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/reset', {
		path: '/reset',
		pageTitle: 'Reset Password',
		errorMessage: message
	});
};

exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect('/reset');
		}
		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email })
			.then(user => {
				if (!user) {
					req.flash('error', 'No account with that email found.');
					return res.redirect('/reset');
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000;
				return user.save();
			})
			.then(result => {
				res.redirect('/');
				//mail code here
			})
			.catch(err => {
				console.log(err);
			});
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
		.then(user => {
			let message = req.flash('error');
			if (message.length > 0) {
				message = message[0];
			} else {
				message = null;
			}
			res.render('auth/new-password', {
				path: '/new-password',
				pageTitle: 'New Password',
				errorMessage: message,
				userId: user._id.toString(),
				passwordToken: token
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postNewPassword = (req, res, next) => {
	const newPassword = req.body.password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;
	let resetUser;

	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId
	})
		.then(user => {
			resetUser = user;
			return bcrypt.hash(newPassword, 12);
		})
		.then(hashedPassword => {
			resetUser.password = hashedPassword;
			resetUser.resetToken = undefined;
			resetUser.resetTokenExpiration = undefined;
			return resetUser.save();
		})
		.then(result => {
			res.redirect('/login');
		})
		.catch(err => {
			console.log(err);
		});
};
