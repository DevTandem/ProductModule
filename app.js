const express = require("express");
const { client } = require("./config/db");

const app = express();

const PORT = 5005;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

client.connect().then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.log(err);
});