const jwt = require("jsonwebtoken")
const {secret } = require("../config/jwtconfig")

const generate_token = (user) => {
    const payload = {
        id : user.id,
        name : user.name,
        email : user.email
    }

    return jwt.sign(payload , secret , {expiresIn:'1h'})
}

module.exports = {
    generate_token
}