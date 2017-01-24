const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// Define our model
const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String
});

// run before saving a model
userSchema.pre('save', function(next) {
	// get access to the user model
	const user = this;
	
	bcrypt.genSalt(10, function(err, salt) {
		if (err) { return next(err); }
		
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) { return next(err); }
			
			// overwrite plain text password with encrypted password
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) { return callback(err); }

		callback(null, isMatch);
	})
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;