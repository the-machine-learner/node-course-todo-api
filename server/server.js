var express = require('express');
var bodyParser = require('body-parser');

var { mongoose} = require('./db/mongoose');
mongoose.Promise = global.Promise;

var {Todo} = require('./models/todo');
var {User} = require('./models/user');
 
var app = express();

 //crud -> create - read - update - delete
// for creating we use post method  

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

module.exports = {app};
//for reading

app.listen(3000,()=>{
	console.log('Started on port 3000');
});
























