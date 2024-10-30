const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs")
const {generate_token} = require("../utils/generate_token")

const user_signup = async(req , res) => {
    const {name , email , password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields must be provided." });
      }

    try {

        const check_email = await prisma.userLogin.findUnique({
            where : {
                email : email
            }
        })

        if(check_email){
            return res.status(404).json({message : "User already exist"})
        }

        const hashedPassword = bcrypt.hashSync(password);

        const user = await prisma.userLogin.create({
            data : {
                name : name , 
                email : email,
                password : hashedPassword
            }
        })

        if (!user) {
            return res.status(400).json("User not created");
          }

        return res.status(200).json({ message: "User created successfully", user });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error });
    }
}

const user_signin = async(req , res) => {
    const {email , password} = req.body

    if(!email || !password){
        return res.status(400).json({ message: "All fields must be provided." });
    }

    try {

        const check_user = await prisma.userLogin.findUnique({
            where : {
                email : email
            }
        })

        if (!check_user) {
            return res.status(404).json({ message: "Email Id Incorrect" });
        }

        const check_password = bcrypt.compareSync(password , check_user.password)

        if (!check_password) {
            return res.status(404).json({ message: "Password Incorrect" });
        }

        token = generate_token(check_user)

        if (!token) {
            return res.status(400).json({ message: "Token not generated" });
        }
      
        console.log("token generated success")
        console.log(token)
        return res.send(token)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error });
    }
}