const express = require("express");
const { client } = require("./config/db");

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

client.connect().then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.log(err);
});