if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const route = require('./routes/index');
const authors = require('./routes/authors');

const app = express();

//bodyparse middleware, inbuilt.
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/', route);
app.use('/authors', authors);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => console.error('error connection to DB'));
db.once('open', () => console.log('Connected to Mongoose'));

app.listen(process.env.PORT || 4200, () =>
	console.log('Server listning @ 4200')
);
