const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoSessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flashMsg = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/users');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const app = express();
const store = new mongoSessionStore({
	uri:
		'mongodb+srv://nikhil:goolluu@ecomproj-ono9g.mongodb.net/Shop?retryWrites=true&w=majority',
	collection: 'session'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'secret key',
		resave: false,
		saveUninitialized: false,
		store: store
	})
); //1
app.use(csrfProtection);
app.use(flashMsg());

app.use((req, resp, next) => {
	if (!req.session.user) {
		next();
	} else {
		User.findById(req.session.user._id)
			.then(user => {
				console.log('App user:', user);
				req.user = user; //2
				next();
			})
			.catch(err => console.log('User login err :', err));
	}
});

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

/* With Mongoose */
mongoose
	.connect(
		'mongodb+srv://nikhil:goolluu@ecomproj-ono9g.mongodb.net/Shop?retryWrites=true&w=majority',
		{ useNewUrlParser: true }
	)
	.then(result => {
		app.listen(3000, () => {
			console.log('Connected to Node Server @ Port, 3000');
			console.log('Connected to MongoDB Server: ');
		});
	})
	.catch(err => console.log('Mongoose Connection Error : ', err));

/* Without Mongoose */
// app.listen(3000, () => {
// 	console.log('Connected to Node Server @ Port, 3000');
// 	db.client(client => {
// 		console.log('Connected to MongoDB Server: ');
// 	});
// });

//1. session & cookies
//2. this initialization will provide us with user login credential across all request we make.
