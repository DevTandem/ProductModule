// const {PrismaClient} = require("@prisma/client")
// const prisma = new PrismaClient()

const product_model = require("../model/product_model")


const get_products = async (req, res) => {
    const { search_keyword, pricing, colour, characteristics } = req.query;
    const obj = req.user;
    console.log("Search keyword:", search_keyword);

    try {
        if (!obj) {
            return res.status(404).json({ message: "User not found" });
        }

        // Initial search criteria based on keyword, price, and color
        const searchCriteria = {
            $or: [
                { c_name: { $regex: search_keyword, $options: "i" } },
                { s_name: { $regex: search_keyword, $options: "i" } },
                { description: { $regex: search_keyword, $options: "i" } }
            ]
        };

        if (pricing) {
            searchCriteria.price = { 
                $gte: parseFloat(pricing) * 0.9, 
                $lte: parseFloat(pricing) * 1.1 
            };
        }

        if (colour) {
            searchCriteria.colour = {
                $elemMatch: { colour_name: { $regex: colour, $options: "i" } }
            };
        }

        // Fetch initial set of products matching the search criteria
        const products = await product_model.find(searchCriteria).limit(10);

        // Create a dynamic list of unique characteristics from the matched products
        const characteristicsList = {};
        products.forEach(product => {
            product.characteristics.forEach((value, key) => {
                if (!characteristicsList[key]) {
                    characteristicsList[key] = new Set();
                }
                characteristicsList[key].add(value);
            });
        });

        // Convert characteristic Sets to arrays for easier frontend handling
        Object.keys(characteristicsList).forEach(key => {
            characteristicsList[key] = Array.from(characteristicsList[key]);
        });

        // Apply additional filtering if specific characteristics are provided
        let filteredProducts = products;
        if (characteristics) {
            const selectedCharacteristics = JSON.parse(characteristics); // Expect JSON format in query, e.g., '{"color": "red", "size": "large"}'
            filteredProducts = products.filter(product => {
                return Object.entries(selectedCharacteristics).every(([key, value]) => {
                    return product.characteristics.get(key) === value;
                });
            });
        }

        // Filter color matches within the color array of each product if `colour` is specified
        if (colour) {
            filteredProducts = filteredProducts.map(product => {
                product.colour = product.colour.filter(c => 
                    new RegExp(colour, "i").test(c.colour_name)
                );
                return product;
            });
        }

        console.log("Products:", filteredProducts);
        return res.status(200).json({ 
            message: "Products found", 
            products: filteredProducts, 
            characteristicsList // Dynamic list of characteristics for filtering
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = {
    get_products
};



module.exports = {
    get_products
}