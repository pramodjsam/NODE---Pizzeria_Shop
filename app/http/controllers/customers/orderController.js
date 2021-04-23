const moment = require("moment");
const Order = require("../../../models/Order");

exports.store = async (req,res)=>{
	try{
		const {phone,address} = req.body;
		if(!phone || !address){
			req.flash("error","All fields are required;");
			return res.redirect("/cart");
		}
		const order = await Order.create({
			customerId:req.user._id,
			items:req.session.cart.items,
			phone:phone,
			address:address
		})
		const emitter = req.app.get("eventEmitter");
		emitter.emit("orderPlaced",order)
		req.flash("success","Order places successfully");
		delete req.session.cart
		return res.redirect("/customer/orders")
	}catch(err){
		console.log(err)
		req.flash("error","Something went wrong");
		return res.redirect("/cart");
	}
}

exports.index = async (req,res) =>{
	try{
		const orders = await Order.find({customerId:req.user._id},
			null,{
				sort:{"createdAt":-1}
			});
		res.header("Cache-Control","no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0")
		res.render("customers/orders",{orders:orders,moment:moment})
	}catch(err){
		req.flash("error","Something went wrong");
		return res.redirect("/customers/orders");
	}
}

exports.show = async (req,res) =>{
	try{
		const order = await Order.findById(req.params.id);

		if(req.user._id.toString() === order.customerId.toString()){
			return res.render("customers/singleOrder",{order:order})
		}
		res.redirect("/")
	}catch(err){
		console.log(err);
		return res.redirect("/")
	}
}