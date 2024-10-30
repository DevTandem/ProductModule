const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

const get_products = async(req , res ) => {
    const {search_keyword , pricing} = req.query
    const obj = req.user
    try {

        if(!obj){
            return res.status(404).json({message : "User not found"})
        }

        if(pricing){
            const products = await prisma.product.findMany({
                where : {
                    c_name : {
                        contains : search_keyword || ""
                    },
    
                    price : {
                        gt : parseFloat(pricing)-100.00,
                        lt : parseFloat(pricing)+100.00 
                    }
                },
                take : 10
            })
            return res.status(200).json({message : "Products" , products})
        }

        else {
            const products = await prisma.product.findMany({
                where : {
                    c_name : {
                        contains : search_keyword || ""
                    },
                },
                take : 10
            })
            return res.status(200).json({message : "Products" , products})
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error });
    }
}

module.exports = {
    get_products
}