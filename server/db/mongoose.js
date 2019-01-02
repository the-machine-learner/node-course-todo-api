var mongoose = require('mongoose');
mongoose.Promise = Promise;

let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://ritvik:abc123@ds145434.mlab.com:45434/todo_app'
};
mongoose.connect( db.mlab||db.localhost );
module.exports = {
	mongoose
};