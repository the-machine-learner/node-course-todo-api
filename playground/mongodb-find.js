const {MongoClient,ObjectID} = require('mongodb');

 
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
	if(err){
		return console.log('Unable to connect MongoDB server');

	}
	console.log('Connected to MongoDB server');

//  query
	db.collection('Todos').find().toArray().then((docs)=>{
		console.log('Todos');
		console.log(JSON.stringify(docs,undefined,2));
	},(err)=>{
		console.log('Unable to fetch todos',err);
	});

//query with a condition *cant be used with object ID as it is a different kind of data structure and not string
	db.collection('Todos').find({completed:false}).toArray().then((docs)=>{
		console.log('Todos');
		console.log(JSON.stringify(docs,undefined,2));
	},(err)=>{
		console.log('Unable to fetch todos',err);
	});

//This query works
	db.collection('Todos').find({_id: new ObjectID("5c226fc4737386a5c5d7379f")}).toArray().then((docs)=>{
		console.log('Todos');
		console.log(JSON.stringify(docs,undefined,2));
	},(err)=>{
		console.log('Unable to fetch todos',err);
	});

// Study documentation

	//db.close();	
});