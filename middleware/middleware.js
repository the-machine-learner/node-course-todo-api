const {User} = require('./../server/models/user');

var authentication = (req,res,next)=>{
	var token = req.header('x-auth');
	// console.log(token);
	User.findByToken(token).then((user)=>{
		if(!user) {
			// console.log('\n user not found');
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