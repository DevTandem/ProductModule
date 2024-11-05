const product_model = require("../model/product_model")
const log_model = require("../model/log_maintain")

const create_product = async (req, res) => {
    const { c_name, s_name, qty, price, description, colour , characteristics} = req.body;
    const owner = req.user;

    if (!owner) {
        return res.status(404).json({ message: "User not found" });
    }

    if (!c_name || !s_name || !qty || !price) {
        return res.status(400).json({ message: "All fields must be provided" });
    }

    try {
        var colours
        if(colour.length){
            colours = colour.map((name, index) => ({
                colour_name: name["colour_name"],
            }));
        }

        const product = new product_model({
            owner_id: owner.id,
            c_name: c_name,
            s_name: s_name,
            price: price,
            description: (!description) ? "" : description,
            qty: qty,
            colour: colours, 
            characteristics : characteristics
        });

        await product.save();

        if (!product) {
            return res.status(400).json({ message: "Error occurred while creating the product" });
        }

        console.log("Products : " , product)
        return res.status(200).json({ message: "Product created successfully", product });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};


const update_product = async (req,res) => {
    const {productId} = req.params
    const {add_qty, sub_qty} = req.body

    if(!add_qty && !sub_qty){
        return res.status(400).json({message: "Enter the quantity of products required"})
    }
    const user = req.user

    if(!user){
        return res.status(404).json({message: "User not found"})
    }

    try {
        var product_detail
        if(add_qty){
            product_detail = await product_model.findOne({
                    _id: productId, owner_id: user.id
            })
        }else{
            product_detail = await product_model.findOne({
                _id: productId
        })
        }
        if(!product_detail){
            return res.status(404).json({message: "Product not found"})
        }

        var rem_qty;

        if(add_qty){

            rem_qty = product_detail.qty + parseInt(add_qty)

        }else{

            const check_qty = product_detail.qty - parseInt(sub_qty)
            
            if(check_qty < 0){
                return res.status(200).json({message: `Available quantity for the product is ${product_detail.qty}`})
            }
            
            rem_qty = check_qty
        }


            const product = await product_model.findByIdAndUpdate(productId, { qty: rem_qty }, { new: true })
            
            if(!product)
                return res.status(400).json({message: "Product's quantity not updated"})

            const log = await log_model.create({
                    product_id: productId,
                    user_id: user.id,
                    prev_qty: product_detail.qty,
                    new_qty: rem_qty,
            })

            if(!log){
                return res.status(400).json({message: "Error occured while creating LOG"})
            }
            
            return res.status(200).json({message: "Successfully Updated Product and created log",product,log})

    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error });

    }
}


const modify_product = async (req,res)=>{
    const {productId} = req.params
    const {c_name, s_name, description} = req.body

    const user = req.user

    if(!user){
        return res.status(404).json({message: "User not found"})
    }

    if(!c_name && !s_name && !description){
        return res.status(400).json({message: "Enter the new name"})
    }

    try {
        const product_detail = await product_model.findOne({
            _id: productId, owner_id: user.id
        })

        if(!product_detail){
            return res.status(404).json({message: "Product not found"})
        }

        var update = {}

        if (c_name) update["c_name"] = c_name;
        if (s_name) update["s_name"] = s_name;
        if (description) update["description"] = description;

        const product = await product_model.findByIdAndUpdate(productId, update , { new: true })

        if(!product)
            return res.status(400).json({message: "Product's quantity not updated"})

        return res.status(200).json({message: "Updated Successfully", product})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error });
    }

}


module.exports = {
    create_product,
    update_product,
    modify_product
}