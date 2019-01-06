const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');  //advanced lib
const bcrypt = require('bcryptjs');

var password = '123abc';
bcrypt.genSalt(10,(err,salt)=>{
	bcrypt.hash(password,salt,(err,hash)=>{
		console.log(hash);
	});
});

var hashedPassword =  '$2a$10$fCxOkCykXzAy71WJHJiUTeeBXGy18TIotalzbgp.QcpKrGbaK4Yva';

bcrypt.compare(password, hashedPassword, (err,res)=>{
	console.log(res);
});

//2.step
// var data = {
// 	id: 10
// };

// var token = jwt.sign(data,'salt');
// console.log(token);

// var decoded = jwt.verify(token,'salt');

// console.log('decoded',decoded);

// 1. step
// var message = 'I am number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);

// console.log(`Hash: ${hash}`);

// var data = {
// 	id: 4
// };
// var salt = 'some Secret';
// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data)+salt).toString()
// };

// var resultHash = SHA256(JSON.stringify(data).toString());
// if(resultHash = token.hash)
// {
// 	console.log('Data was not changed');
// }else{
// 	console.log('Data was changed !!!!!!!');
// }


//Data is not stored as plain text but hash because, easily the user could send id = 5 instead of 4 to get access to 
// the next entry as 5 matches another entry in our database, but if we use a hash instead So, even he sends 5 instead
// of 4 the token(hash + data) won't match the stored tokes hash mapped against him he will neither be able to log into his account nor someone 
// elses, but if he guesses the hash so he can hash the data himself and send a duplicate token which will work.
// Adding a salt makes the task even more secure as he can not guess what salt have we used, so the token sent by him will still not match ours.
