const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

 var id = '5c29afbf737386a5c5d8250c';


Todo.find({
	_id: id
}).then((todos)=>{
	console.log('Todos',todos);
});

// Todo.findone({
// 	_id: id
// }).then((todo)=>{
// 	console.log('Todo',todo); 
// });

// Todo.findById(id).then((todo)=>{
// 	if(!todo){
// 		return console.log('Id not found');
// 	}
// 	console.log('Todo by ID',todo);
// },(e)=>{
// 	console.log(e);
// });

// User.findById(id).then((user)=>{
// 	if(!user){
// 		return console.log('Id not found');
// 	}
// 	console.log('user',user);
// },(e)=>{
// 	console.log(e);
// });