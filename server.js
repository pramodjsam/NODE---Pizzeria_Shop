const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({path:"./app/config/config.env"});
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const connectDB = require("./app/config/db");
const colors = require("colors");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const webRoutes = require("./routes/web");
const MongoDBStore = require("connect-mongo");
const Emitter = require("events");


const app = express();

connectDB();

const eventEmitter = new Emitter();

app.set("eventEmitter",eventEmitter);

app.use(session({
	secret:process.env.COOKIE_SECRET,
	resave:false,
	store:MongoDBStore.create({
		mongoUrl:process.env.MONGO_URI,
		collection:"sessions"
	}),
	saveUninitialized:false,
	cookie:{maxage: 24*60*60*1000}
}));
app.use(flash());

// Passport
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static("public"));

app.use((req,res,next)=>{
	res.locals.session = req.session;
	res.locals.user = req.user;
	next();
})

app.use(expressLayout);
app.set("views",path.join(__dirname,"/resources/views"));
app.set("view engine","ejs");

app.use("/",webRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,()=>{
	console.log(`Listening on port ${PORT}`.yellow.bold);
})

const io = require("socket.io")(server);

io.on("connection",(socket)=>{
	socket.on("join",(orderId)=>{
		socket.join(orderId);
	})
})

eventEmitter.on("orderUpdated",(data)=>{
	io.to(`order_${data.id}`).emit("orderUpdated",data)
})

eventEmitter.on("orderPlaced",(data)=>{
	io.to("adminRoom").emit("orderPlaced",data);
})