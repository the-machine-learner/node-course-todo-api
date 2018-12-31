const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

const {ObjectID} = require('mongodb');

// Todo.remove({}).then((result)=>{
// 	console.log(result);
// });

Todo.findByIdAndRemove('5c29afbf737386a5c5d8250c').then((result)=>{
	console.log(result);
});