const mongoose = require("mongoose")

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

        colour: {
            type: [String],  
          },

        characteristics : {
            type : Map,
            of : String
        },

        embedding : [Number]

    },
    {timestamps : true}
)

const products = new mongoose.model("product" , product)

module.exports = products
