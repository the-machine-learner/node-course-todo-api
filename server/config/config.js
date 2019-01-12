var env = process.env.NODE_ENV || 'development';
console.log('env *****',env);

if (env === "development" || env === "test"){
	var config = require('./config.json');
	var envConfig = config[env];
	 console.log(Object.keys(envConfig));   

	Object.keys(envConfig).forEach((key)=>{
		process.env[key] = envConfig[key];
	});	
}
else{
	process.env.MONGOBD_URI = 'mongodb://ritvik:abc123@ds145434.mlab.com:45434/todo_app';
	process.env.JWT_SECRET = "ewrtghbvfdcear4583fgvcdfzcx";
}

// if(env === 'development') {
// 	process.env.PORT = 3000;
// 	process.env.MONGOBD_URI = 'mongodb://localhost:27017/TodoApp';
// }
// else if(env === 'test') {
// 	process.env.PORT = 3000;
// 	process.env.MONGOBD_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
// else{
// 	process.env.MONGOBD_URI = 'mongodb://ritvik:abc123@ds145434.mlab.com:45434/todo_app';
// }