const express = require("express");
const {homeController} = require("../app/http/controllers/homeController");
const {loginController,
	registerController,
	postRegister,
	postLogin,
	logout} = require("../app/http/controllers/authController");
const orderController = require("../app/http/controllers/customers/orderController");
const adminOrderController = require("../app/http/controllers/admin/orderController");
const statusController = require("../app/http/controllers/admin/statusController");
const cartController = require("../app/http/controllers/customers/cartController");
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");
const router = express.Router();

router.get("/",homeController);

router.get("/cart",cartController.index);

router.get("/login",guest, loginController);
router.post("/login",postLogin);

router.get("/register",guest ,registerController);
router.post("/register",postRegister);

router.get("/logout",logout)

router.post("/update-cart",cartController.update)

router.post("/orders",auth, orderController.store);
router.get("/customer/orders",auth, orderController.index);
router.get("/customer/orders/:id",auth, orderController.show);

router.get("/admin/orders",admin ,adminOrderController.index);

router.post("/admin/order/status",admin ,statusController.update);

module.exports = router;