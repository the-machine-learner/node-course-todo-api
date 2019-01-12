require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
var {ObjectID} = require('mongodb');
var { mongoose} = require('./db/mongoose');
const bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;

var {Todo} = require('./models/todo');
var {User} = require('./models/user.js');
var {authentication} = require('./../middleware/middleware.js');

var app = express();

 //crud -> create - read - update - delete
// for creating we use post method  

port = process.env.PORT;

app.use(bodyParser.json());   //using it we can send JSON to our application

app.post('/todos',authentication,(req,res)=>{
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id

	});
	todo.save().then((doc)=>{
		res.send(doc);
	},(e)=>{
		res.status(400).send(e);
	});
});

app.get("/",(req,res)=>{
	res.send("<h1>Welcome to Todos APP</h1>");
});

app.get("/todos",authentication,(req,res)=>{
	Todo.find({_creator: req.user._id}).then((todos)=>{
		res.send({todos});
	},(e)=>{res.status(400).send(e);});
});

app.get('/todos/:id',authentication,(req,res)=>{
	var id = req.params.id;

	if(!ObjectID.isValid(id))
	{
			console.log(id);
		return res.status(404).send();
	} 
	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo)=>{
	if(!todo){
		return res.status(404).send();
	}
	res.send({todo});
	});
});

app.delete('/todos/:id',authentication,(req,res)=>{
	var id = req.params.id;
	if(!ObjectID.isValid(id))
	{
			return res.status(404).send('Invalid ID');
	}
	Todo.findOneAndRemove({
		_id:id,
		_creator:req.user._id
	}).then((todo)=>{
		if(!todo){
			return res.status(404).send();				
		}
		res.send({todo});
	},(e)=>{
		return res.status(404).send();
	});
});

app.patch('/todos/:id',authentication,(req,res)=>{
	var id = req.params.id;
	var body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
    	return res.status(400).send();
    }	
    if(_.isBoolean(body.completed) && body.completed)
    {
    	body.completedAt = new Date().getTime();
    } else{
    	body.completed = false;
    	body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:body},{new:true}).then((todo)=>{
    	if(!todo){
    		return res.status(404).send();
    	}
    	res.send({todo});
    },(e)=>{
    	res.status(400).send();
    });
});


//POST USER
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);	
  }).catch((e) => {
    res.status(400).send(e);
  });
});

//GET USER
// app.get('/users/me',(req,res)=>{
// 	var token = req.header('x-auth');
// 	User.findByToken(token).then((user)=>{
// 		if(!user) {
// 			return Promise.reject(); //control passes to catchblock
// 		}

// 		res.send(user);
// 	}).catch((e)=>{
// 		res.status(401).send();
// 	});
// });

//Middleware version of GET USER
app.get('/users/me',authentication,(req,res)=>{
	res.send(req.user);
});

//POST USER LOGIN
app.post('/users/login',(req,res)=>{

	var pass = req.body.password;

	User.find({email:req.body.email}).then((user)=>{
		bcrypt.compare(pass,user[0].password,(err,response)=>{
		if(response)
			return user[0].generateAuthToken().then((token)=>{
				res.header('x-auth', token).send(user);				
			});
		else
			res.status(401).send();
	});

	}).catch((e)=>{
		res.status(401).send();
	});

});

app.delete('/users/me/token',authentication,(req,res)=>{
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send();
	},()=>{
		res.status(400).send();
	});
});

module.exports = {app};

app.listen(port,()=>{
	console.log(`Started on port ${port}`);
});
