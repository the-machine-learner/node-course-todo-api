const {MongoClient,ObjectID} = require('mongodb');

 
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
	if(err){
		return console.log('Unable to connect MongoDB server');

	}
	console.log('Connected to MongoDB server');

	// db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
	// 	console.log(result);

	// });

	db.collection('users').findOneAndUpdate({
		name: "Ram"
	},{
		$inc:{age: 2}
	},{
		returnOrignal:true
	}).then((result)=>{
		console.log(result);
	});
	//db.close();	
});

//Methods of deletion - 
//deleteOne
//deleteMany
//findOneAndDelete

//These methods return a promise