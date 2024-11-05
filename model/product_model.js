const mongoose = require("mongoose")

const colour_schema = new mongoose.Schema(
    {
        colour_name : {
            type : String
        }
    }
)

const product = new mongoose.Schema(
    {  
        owner_id : {
            type : String,
            required : true
        },

        c_name : {
            type : String,
            required : true
        },

        s_name : {
            type : String,
            required : true
        },

        description : {
            type : String,
        },

        price : {
            type : String,
            required : true
        },

        qty : {
            type : Number,
            required : true
        },

        colour : [colour_schema],

        characteristics : {
            type : Map,
            of : String
        }

    },
    {timestamps : true}
)

const products = new mongoose.model("product" , product)

module.exports = products
