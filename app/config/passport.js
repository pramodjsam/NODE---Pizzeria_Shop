const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");


function init(passport){
	passport.use(new LocalStrategy({usernameField:"email"},async (email,password,done)=>{
		const user = await User.findOne({email:email})
		if(!user){
			return done(null,false,{message:"No user found"})
		}
		try{
			const matchPassword = await bcrypt.compare(password,user.password);
			if(matchPassword){
				return done(null,user,{message:"Logged in successfully"})
			}else{
				return done(null,false,{message:"Wrong username or password"})
			}
		}catch(err){
			return done(null,false,{message:"Something went wrong"})
		}
	}))

	passport.serializeUser((user,done)=>{
		return done(null,user._id)
	})

	passport.deserializeUser((id,done)=>{
		User.findById(id,(err,user)=>{
			done(err,user);
		})
	})
}

module.exports = init;