var mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.connect( process.env.MONGOBD_URI);
module.exports = {
	mongoose
};