const pg = require("pg")
require("dotenv").config()


const client = new pg.Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:process.env.DB_PASSWORD,
    database:"ProductModule"
})

module.exports = {
    client
}