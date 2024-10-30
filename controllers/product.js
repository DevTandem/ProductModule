const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();

const create_product = async (req,res) => {
    const {c_name, s_name, qty, price, description} = req.body
    const owner = req.user

    if(!owner){
        return res.status(404).json({message: "User not found"})
    }

    if(!c_name || ! s_name || !qty || !price){
        return res.status(400).json({message: "All fields must be provided"})
    }
    
    try {
        const product = await prisma.product.create({
            data:{
                c_name: c_name,
                s_name: s_name,
                qty: qty,
                price: price,
                description: description,
                ownerId: owner.id
            }
        })

        if(!product)
            return res.status(400).json({message: "Error occured while creation of product"})

        return res.status(200).json({message: "Prouduct", product})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error });

    }
}


const update_product = async (req,res) => {
    const {productId} = req.params
    const {qty} = req.body

    if(!qty){
        return res.status(400).json({message: "Enter the quantity of products required"})
    }
    const user = req.user

    if(!user){
        return res.status(404).json({message: "User not found"})
    }

    try {
        
        const product_detail = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })

        if(!product_detail){
            return res.status(404).json({message: "Product not found"})
        }

        const rem_qty = product_detail.qty - parseInt(qty)
        if(rem_qty<0){
            return res.status(200).json({message: `Available quantity for the product is ${product_detail.qty}`})
        }
        else{
            const product = await prisma.product.update({
                where:{
                    id : productId
                },
                data:{
                    qty: rem_qty
                }
            })
            if(!product)
                return res.status(400).json({message: "Product's quantity not updated"})

            const log = await prisma.log_maintain.create({
                data:{
                    productId: productId,
                    userId: user.id,
                    previous_qty: product_detail.qty,
                    new_qty: rem_qty,
                }
            })
            if(!log){
                return res.status(400).json({message: "Error occured while creating LOG"})
            }
            
            return res.status(200).json({message: "Successfully Updated Product and created log"})
        }



    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error });

    }


}


module.exports = {
    create_product,
    update_product
}