const Order = require("../../../models/Order");

exports.index =async (req,res) =>{
	try{
		const orders = await Order.find({status:{$ne:"completed"}},
			null,
			{sort:{"createdAt":-1}}).populate("customerId","-password");
		if(req.xhr){
			return res.json(orders)
		}
		return res.render("admin/orders",{orders:orders})
	}catch(err){
		req.flash("error","Something went wrong");
		return res.redirect("/");
	}
}