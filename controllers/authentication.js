const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	// Existing properties on jwt's
		// sub: "subject"
		// iat: "issued at time"
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
	// User is authenticated from local strategy
	// Just need to send token
	res.send({ token: tokenForUser(req.user) })
}

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		res.send({ error: 'You must provide email and password' });
	}
	// See if a user with the given email exists
	User.findOne({ email: email }, (err, existingUser) => {
		// If a user with email does exist, return an error
		if (err) { return next(err); }
		// If a user with email does NOT exist, create and save user record
		if (existingUser) {
			return res.send({ error: 'Email is in use' });
		}
		const user = new User({
			email: email,
			password: password
		});

		user.save(err => {
			if (err) {return next(err)}
		});
		// Respond to request indicating the user was created
		res.json({ token: tokenForUser(user) });
	})
}