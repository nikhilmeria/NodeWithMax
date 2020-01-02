const express = require('express');
const path = require('path');
const app = express();

const adminRoute = require('./routes/adminRoute');
const shopRoute = require('./routes/shopRoute');
const errCntrl = require('./controller/error');

//Setting up the templating engine ie, view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//Body-Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Path to static web assets
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoute);
app.use('/', shopRoute);

//if no route is matched we then display an error page
app.use(errCntrl.errPage);

app.listen(3000, () => console.log('Listening on Port no : 3000 '));
