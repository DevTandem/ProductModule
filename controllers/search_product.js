const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

const get_products = async(req , res ) => {
    const {search_keyword , pricing} = req.query
    const obj = req.user
    console.log("search keyowrd" , search_keyword)
    try {

        if(!obj){
            return res.status(404).json({message : "User not found"})
        }

        if(pricing){
            const products = await prisma.product.findMany({
                where : {
                    OR:[
                        {s_name : {
                            contains : search_keyword || "",
                            mode: 'insensitive'
                        },},
                    
                        {c_name : {
                            contains : search_keyword || "",
                            mode: 'insensitive'
                        },}
                    ],
                    
    
                    price : {
                        gt : parseFloat(pricing)*0.9,
                        lt : parseFloat(pricing)*1.1
                    }
                },
                take : 10
            })
            return res.status(200).json({message : "Products" , products})
        }

        else {
            const products = await prisma.product.findMany({
                where : {
                    OR:[
                        {s_name : {
                            contains : search_keyword || "",
                            mode: 'insensitive'
                        },},
                    
                        {c_name : {
                            contains : search_keyword || "",
                            mode: 'insensitive'
                        },}
                    ],
                    
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