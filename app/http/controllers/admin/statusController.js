const Order = require("../../../models/Order");

exports.update = async (req,res) =>{
	try{
		const order = await Order.findByIdAndUpdate(req.body.orderId,{
			status:req.body.status
		})
		const emitter = req.app.get("eventEmitter");
		emitter.emit("orderUpdated",{id:req.body.orderId, status:req.body.status})
		return res.redirect("/admin/orders")
	}catch(err){
		return res.redirect("/admin/orders")
	}
}
