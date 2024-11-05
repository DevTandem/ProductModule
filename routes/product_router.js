const express = require("express");
const product_control = require("../controllers/product");
const { auth_middleware } = require("../middleware/auth");
const search_product = require("../controllers/search_product")

const product_router = express.Router();

product_router.post("/user_signIn/:token/create_product",auth_middleware,product_control.create_product);
product_router.put("/user_signIn/:token/update_product/:productId",auth_middleware,product_control.update_product);
product_router.put("/user_signIn/:token/update_product/:productId/name",auth_middleware,product_control.modify_product);
product_router.get("/user_signIn/:token/products" , auth_middleware , search_product.get_products)

module.exports = product_router;
