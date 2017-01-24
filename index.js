const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express(express);
const router = require('./router');
const authentication = require('./controllers/authentication');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:auth/auth');

app.use(morgan('dev'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

var port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('Server is listening to port, ' + port);
})