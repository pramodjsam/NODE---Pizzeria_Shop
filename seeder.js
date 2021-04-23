const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({path:"./app/config/db"});
const colors = require("colors");
const mongoose = require("mongoose");
const Menu = require("./app/models/Menu");

const connectDB = async() =>{
	const conn = await mongoose.connect(process.env.MONGO_URI,{
		useNewUrlParser:true,
		useCreateIndex:true,
		useFindAndModify:false,
		useUnifiedTopology:true
	})
	console.log(`MONGODB host: ${conn.connection.host}`);
}

connectDB();

const menus = JSON.parse(fs.readFileSync(`${__dirname}/menus.json`),"utf-8");

const importData =async () =>{
	try{
		await Menu.create(menus);
		console.log("Date imported".green.inverse);
		process.exit();
	}catch(err){
		console.log(err);
		process.exit(1);
	}
}

const deleteData = async() =>{
	try{
		await Menu.deleteMany();
		console.log("Date deleted".red.inverse);
		process.exit();
	}catch(err){
		console.log(err);
		process.exit(1);
	}
}

if(process.argv[2] === "-i"){
	importData();
}else if(process.argv[2] === "-d"){
	deleteData();
}