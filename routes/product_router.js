const express = require("express");
const product_control = require("../controllers/product");
const { auth_middleware } = require("../middleware/auth");
const search_product = require("../controllers/search_product")

const product_router = express.Router();

product_router.post("/user_signIn/:token/create_product",auth_middleware,product_control.create_product);
product_router.put("/user_signIn/:token/update_product/:productId",auth_middleware,product_control.update_product);
product_router.get("/user_signIn/:token/products" , auth_middleware , search_product.get_products , (req, res)=>{
  const {search_keyword} = req.query
  const {pricing} = req.query

  res.send(`search_keyword : ${search_keyword}` , `pricing : ${pricing}`)
})

module.exports = product_router;
