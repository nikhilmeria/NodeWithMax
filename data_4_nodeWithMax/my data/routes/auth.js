const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');

const User = require('../models/users');
const authCtrl = require('../controllers/auth');

//Sign In Route
router.get('/login', authCtrl.getLogin);

//Logged In Route
router.post('/login', authCtrl.postLogin);

//SignUp get Route
router.get('/signup', authCtrl.getSignup);

//SignUp post Route
router.post(
	'/signup',
	[
		check('email')
			.isEmail()
			.withMessage('Please enter a valid email id')
			.custom((value, { req }) => {
				if (value === 'abc@abc.com') {
					throw new Error('this email is dummy');
				}
				//return true
				return User.findOne({ email: value }).then(userDoc => {
					if (userDoc) {
						return Promise.reject(
							'E-Mail exists already, please pick a different one.'
						);
					}
				});
			}),
		body('password')
			.isLength({ min: 5 })
			.withMessage('Invalid password'),
		check('confirmPassword').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords should Match !!!');
			}
			return true;
		})
	],
	authCtrl.postSignup
);

//Logout Route
router.post('/logout', authCtrl.postLogout);

router.get('/reset', authCtrl.getReset);

router.post('/reset', authCtrl.postReset);

router.get('/reset/:token', authCtrl.getNewPassword);

router.post('/new-password', authCtrl.postNewPassword);

module.exports = router;
