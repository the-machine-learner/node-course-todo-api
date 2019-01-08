const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//Use *method* for defining model instance methods and use *statics* for defining model methods 

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject(); //CONVERTING SCHEMA TO REGULAR OBJECT

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);
  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token){
  var user = this;
  return user.update({
    $pull:{
      tokens:{token}
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
	var decoded;
	try{
		decoded = jwt.verify(token,'abc123');
	}catch (e){
		return Promise.reject('test');

	}
	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};
var User = mongoose.model('User', UserSchema);

// in general middleware decleration goes like this UserSchema.pre(event,function that is run before event);
UserSchema.pre('save',function(next){
	var user = this;

	if(user.isModified('password')){
		bcrypt.genSalt(10,(err,salt)=>{
			bcrypt.hash(user.password,salt,(err,hash)=>{
				user.password = hash;
        next();
			});
		}); 
	}else{
		next();
	}
});


module.exports = {User};



// It is passed as the sucess value as a promise to next then call