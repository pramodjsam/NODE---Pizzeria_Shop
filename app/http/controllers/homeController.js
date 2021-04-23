const Menu = require("../../models/Menu");

exports.homeController =async (req,res)=>{
	const pizzas = await Menu.find();
	res.render("home",{
		pizzas:pizzas
	})
}