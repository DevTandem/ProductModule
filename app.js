const express = require("express");
const mongoose = require("mongoose")

const app = express();

const user_login_router = require("./routes/user_login_routes")
const product_router = require("./routes/product_router")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/main",user_login_router)
app.use("/main",product_router)

const PORT = 5005;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



mongoose.connect(process.env.Mongo_URL)
    .then(() => {
        console.log("Connected to database successfully")
    })
    .catch((err) => {
        console.error("Failed to connect to the database", err)
    });