const mongoose = require("mongoose")

const log_maintain = new mongoose.Schema(
    {
        product_id : {
            type : String,
            required : true
        },
        
        user_id : {
            type : String,
            required : true
        },

        prev_qty : {
            type : Number,
        },

        new_qty : {
            type : Number,
        },

        c_name : {
            type : String,
        },
    },
    {timestamps : true}
)

const log = new mongoose.model("logs" , log_maintain)

module.exports = log
