const User = require("C:/Users/Ritvik/Desktop/portfolio/NodeJs/node-todo-api/server/models/user.js").User;

var authentication = (req,res,next)=>{
	var token = req.header('x-auth');
	User.findByToken(token).then((user)=>{
		if(!user) {
			return Promise.reject(); //control passes to catchblock
		}

		req.user = user;
		req.token = token;
		next(); //called for proceeding to the next part after middleware 
		        //execution
	}).catch((e)=>{
		res.status(401).send();
	});
};

module.exports = {
	authentication
};