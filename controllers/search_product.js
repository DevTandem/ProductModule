const { spawn } = require('child_process');
const product_model = require("../model/product_model");
const axios = require('axios');

const get_products = async (req, res) => {
    const { search_keyword, pricing, colour, characteristics } = req.query;
    const obj = req.user;
    console.log("Search keyword:", search_keyword);

    try {
        if (!obj) {
            return res.status(404).json({ message: "User not found" });
        }

        const pythonResults = await callPythonScript(search_keyword);

        let products = pythonResults;

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

        if (pricing) {
            const priceRange = {
                min: parseFloat(pricing) * 0.9,
                max: parseFloat(pricing) * 1.1,
            };
            products = products.filter(product => 
                product.price >= priceRange.min && product.price <= priceRange.max
            );
        }

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
                    const isArrayOfStrings = product.colour.every(c => typeof c === 'string');
                    if (isArrayOfStrings) {
                        product.colour = product.colour.filter(c =>
                            new RegExp(colour, "i").test(c)
                        );
                    }
                }
                return product;
            });
        }

        console.log("Products:", filteredProducts);
        return res.status(200).json({
            message: "Products found",
            products: filteredProducts,
            characteristicsList,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const callPythonScript = async (searchKeyword) => {
    try {
        const response = await axios.post('http://0.0.0.0:8000/search_products/', {
            query: searchKeyword,
            top_k: 5, 
        });
        return response.data.products;
    } catch (error) {
        throw new Error('Failed to fetch search results from Python service');
    }
};

module.exports = {
    get_products,
};
