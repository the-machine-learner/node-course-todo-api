var env = process.env.NODE_ENV || 'development';
console.log('env *****',env);
if(env === 'development') {
	process.env.PORT = 3000;
	process.env.MONGOBD_URI = 'mongodb://localhost:27017/TodoApp';
}
else if(env === 'test') {
	process.env.PORT = 3000;
	process.env.MONGOBD_URI = 'mongodb://localhost:27017/TodoAppTest';
}
else{
	process.env.MONGOBD_URI = 'mongodb://ritvik:abc123@ds145434.mlab.com:45434/todo_app';
}