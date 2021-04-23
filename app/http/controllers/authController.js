const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const passport = require("passport");

exports.loginController = (req,res) => {
	res.render("auth/login");
}

exports.registerController = (req,res) =>{
	res.render("auth/register")
}

exports.postRegister = async (req,res) =>{
	const {name,email,password} = req.body;

	if(!name || !email || !password){
		req.flash("error","All fields are required");
		req.flash("name",name);
		req.flash("email",email);
		return res.redirect("/register");
	}

	try{
		const userExist = await User.findOne({email:email});
		if(userExist){
			req.flash("error","Email already exists");
			req.flash("name",name);
			req.flash("email",email);
			return res.redirect("/register");
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password,salt);

		const user = await User.create({
			name:name,
			email:email,
			password:hashedPassword
		})
		return res.redirect("/");
	}catch(err){
		req.flash("error","Something went wrong");
		req.flash("name",name);
		req.flash("email",email);
		return res.redirect("/register");
	}
}

// exports.postLogin = (req,res,next) =>{
// 	const {email,password} = req.body;
// 	if(!email || !password){
// 		req.flash("error","All fields are required");
// 		return res.redirect("/login")
// 	}

// 	passport.authenticate("local",{
// 		successRedirect:"/",
// 		failureRedirect:"/register",
// 		failureFlash:true
// 	})(req,res,next)
// }


exports.postLogin = (req,res,next)=>{
	passport.authenticate("local",(err,user,info)=>{
		if(err){
			req.flash("error",info.message);
			return next(err);
		}

		if(!user){
			req.flash("error",info.message);
			return res.redirect("/login")
		}

		req.logIn(user,(err)=>{
			if(err){
				req.flash('error',info.message);
				return next(err)
			}
			return res.redirect(generateUrl(req))
		})
	})(req,res,next)
}

const generateUrl = (req) =>(
	req.user.role === "admin" ? "admin/orders" : "customer/orders"
)

exports.logout = (req,res)=>{
	req.logout();
	return res.redirect("/login")
}