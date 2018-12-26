//const MongoClient = require('mongodb').MongoClient;  is same as
//const ObjectID = require('mongodb').ObjectID;
const {MongoClient, ObjectID} = require('mongodb');   //what we have used here is known as destructuring

var obj = new ObjectID(); // a randomly generated object _id of MongoDB format

//first arguement is responsible for taking in the connection URL and second is a callback function for specifying the status and proceeding accordingly 
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
	if(err){
		return console.log('Unable to connect MongoDB server');

	}
	console.log('Connected to MongoDB server');
	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// },(err, result)=>{
	// 	if(err) {
	// 		return console.log('Unable to insert todo',err);
	// 	}

	// 	console.log(JSON.stringify(result.ops,undefined,2));
	// });
	db.collection('users').insertOne({
		name: 'Ritvik',
		age: '25',
		location: 'Pune',
	},(err,result)=>{
		if(err){
			return console.log('Unable to insert users');
		}
		console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2));
	});
	db.close();	
});