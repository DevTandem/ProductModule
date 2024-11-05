
const product_model = require("../model/product_model");

const get_products = async (req, res) => {
    const { search_keyword, pricing, colour, characteristics } = req.query;
    const obj = req.user;
    console.log("Search keyword:", search_keyword);

    try {
        if (!obj) {
            return res.status(404).json({ message: "User not found" });
        }

        const keywords = search_keyword ? search_keyword.split(" ") : [];
        console.log("split", keywords);

        let products = [];

        for (const word of keywords) {
            const searchCriteria = {
                $or: [
                    { c_name: { $regex: word, $options: "i" } },
                    { s_name: { $regex: word, $options: "i" } },
                    { description: { $regex: word, $options: "i" } }
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

            const new_products = await product_model.find(searchCriteria).limit(10);
            for (const product of new_products) {
                if (!products.some(existingProduct => existingProduct._id.equals(product._id))) {
                    products.push(product);
                }
            }
        }

        console.log("prod", products);

        const characteristicsList = {};
        products.forEach(product => {
            if (product.characteristics) { 
                for (const [key, value] of Object.entries(product.characteristics)) {
                    if (!characteristicsList[key]) {
                        characteristicsList[key] = new Set();
                    }
                    characteristicsList[key].add(value);
                }
            }
        });

        Object.keys(characteristicsList).forEach(key => {
            characteristicsList[key] = Array.from(characteristicsList[key]);
        });

        let filteredProducts = products;
        if (characteristics) {
            const selectedCharacteristics = JSON.parse(characteristics); 
            filteredProducts = products.filter(product => {
                return product.characteristics && Object.entries(selectedCharacteristics).every(([key, value]) => {
                    return product.characteristics[key] === value;
                });
            });
        }

        if (colour) {
            filteredProducts = filteredProducts.map(product => {
                if (product.colour && Array.isArray(product.colour)) {
                    product.colour = product.colour.filter(c => 
                        new RegExp(colour, "i").test(c.colour_name)
                    );
                }
                return product;
            });
        }

        console.log("Products:", filteredProducts);
        return res.status(200).json({ 
            message: "Products found", 
            products: filteredProducts, 
            characteristicsList 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = {
    get_products
};
