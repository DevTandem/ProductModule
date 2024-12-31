const product_model = require("../model/product_model")
const log_model = require("../model/log_maintain");
const { spawn } = require('child_process');
const axios = require('axios');

const create_product = async (req, res) => {
    const { c_name, s_name, price, description, colour, characteristics } = req.body;
    const owner = req.user;

    if (!owner) {
        return res.status(404).json({ message: "User not found" });
    }

    if (!c_name || !s_name || !price) {
        return res.status(400).json({ message: "All fields must be provided" });
    }

    try {
        const productText = `${c_name} ${s_name} ${description || ""} ${Array.isArray(colour) ? colour.join(', ') : ""} color ${Object.entries(characteristics || {}).map(([key, value]) => `${key} ${value}`).join(' ')}`;

        const embedding = await callPythonForEmbedding(productText);

        const product = new product_model({
            owner_id: owner.id,
            c_name: c_name,
            s_name: s_name,
            price: price,
            description: description || "",
            colour: colour,
            characteristics: characteristics,
            embedding: embedding 
        });

        await product.save();

        if (!product) {
            return res.status(400).json({ message: "Error occurred while creating the product" });
        }

        console.log("Product created:", product);
        return res.status(200).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const callPythonForEmbedding = async (productText) => {
    try {
        const response = await axios.post('http://0.0.0.0:8000/generate_embedding/', { text: productText });
        return response.data.embedding;
    } catch (error) {
        throw new Error('Failed to fetch embedding from Python service');
    }
};




const modify_product = async (req, res) => {
    const { productId } = req.params;
    const { c_name, s_name, description, colour, characteristics } = req.body;

    const user = req.user;

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (!c_name && !s_name && !description && !colour && !characteristics) {
        return res.status(400).json({ message: "Enter the fields to update" });
    }

    try {
        const product_detail = await product_model.findOne({
            _id: productId,
            owner_id: user.id
        });

        if (!product_detail) {
            return res.status(404).json({ message: "Product not found" });
        }

        let update = {};
        if (c_name) update["c_name"] = c_name;
        if (s_name) update["s_name"] = s_name;
        if (description) update["description"] = description;
        if (colour) update["colour"] = colour;
        if (characteristics) update["characteristics"] = characteristics;

        const productText = `${update.c_name || product_detail.c_name} ${
            update.s_name || product_detail.s_name
        } ${update.description || product_detail.description || ""} ${
            Array.isArray(update.colour || product_detail.colour)
                ? (update.colour || product_detail.colour).join(", ")
                : ""
        } color ${Object.entries(
            update.characteristics || product_detail.characteristics || {}
        )
            .map(([key, value]) => `${key} ${value}`)
            .join(" ")}`;

        const embedding = await callPythonForEmbedding(productText);

        update["embedding"] = embedding;

        const product = await product_model.findByIdAndUpdate(productId, update, { new: true });

        if (!product) {
            return res.status(400).json({ message: "Product not updated" });
        }

        return res.status(200).json({ message: "Updated Successfully", product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};



module.exports = {
    create_product,
    modify_product
}