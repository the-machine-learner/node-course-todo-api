var {User} = require('./../models/user');

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