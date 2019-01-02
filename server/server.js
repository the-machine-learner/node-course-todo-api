const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
var {ObjectID} = require('mongodb');
var { mongoose} = require('./db/mongoose');

mongoose.Promise = global.Promise;

var {Todo} = require('./models/todo');
var {User} = require('./models/user');
 
var app = express();

 //crud -> create - read - update - delete
// for creating we use post method  

port = process.env.PORT||3000;

app.use(bodyParser.json());   //using it we can send JSON to our application

app.post('/todos',(req,res)=>{
	var todo = new Todo({
		text: req.body.text
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

app.get("/todos",(req,res)=>{
	Todo.find().then((todos)=>{
		res.send({todos});
	},(e)=>{res.status(400).send(e);});
});

app.get('/todos/:id',(req,res)=>{
	var id = req.params.id;

	if(!ObjectID.isValid(id))
	{
			console.log(id);
		return res.status(404).send();
	} 
	Todo.findById(id).then((todo)=>{
	if(!todo){
		return res.status(404).send();
	}
	res.send({todo});
	});
});

app.delete('/todos/:id',(req,res)=>{
	var id = req.params.id;
	if(!ObjectID.isValid(id))
	{
			return res.status(404).send('Invalid ID');
	}
	Todo.findByIdAndRemove(id).then((todo)=>{
		if(!todo){
			return res.status(404).send();				
		}
		res.send({todo});
	},(e)=>{
		return res.status(404).send();
	});
});

app.patch('/todos/:id',(req,res)=>{
	var id = req.params.id;
	var body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
    	return res.status(400).send();
    }	
    if(_.isBoolean(body.completed) && body.completed)
    {
    	body.completedAt = new Date().getTime();
    } else{
    	body.completed = flase;
    	body.completed = null;
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
    	if(!todo){
    		return res.status(404).send();
    	}
    	res.send({todo});
    },(e)=>{
    	res.status(400).send();
    });
});

module.exports = {app};

app.listen(port,()=>{
	console.log(`Started on port ${port}`);
});
