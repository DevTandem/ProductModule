const mongoose = require("mongoose")

const user_login = new mongoose.Schema(
    {
        
        name : {
            type : String,
            required : true
        },

        email : {
            type : String,
            required : true,
            unique : true
        },

        password : {
            type : String,
            required : true
        },
    },
    {timestamps : true}
)

const users = new mongoose.model("user" , user_login)

module.exports = users
