const express = require("express")
const user_login_control = require("../controllers/user_login")

const user_login_router = express.Router()

user_login_router.post("/user_signUp" , user_login_control.user_signup)
user_login_router.get("/user_signIn", user_login_control.user_signin)

module.exports = user_login_router