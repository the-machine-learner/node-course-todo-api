const {MongoClient,ObjectID} = require('mongodb');

 
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
	if(err){
		return console.log('Unable to connect MongoDB server');

	}
	console.log('Connected to MongoDB server');

	// db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
	// 	console.log(result);

	// });

	db.collection('users').deleteMany({name: 'Ritvik'}).then((result)=>{
		console.log(result);
	});

	db.collection('users').deleteOne({_id:ObjectID("5c222d2cf84d2053b0b833a0")}).then((result)=>{
		console.log(result);
	});
	//db.close();	
});

//Methods of deletion - 
//deleteOne
//deleteMany
//findOneAndDelete

//These methods return a promise