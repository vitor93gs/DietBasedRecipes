const router = require("express").Router()
const bcrypt = require("bcrypt")

const generateToken = require("../config/jwt.config")
const UserModel = require("../models/User.model")

const saltRounds = 10

router.post("/signup", async (req,res) => {
    try {
        const {password} = req.body
        if(!password || !password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)){
            return res.status(400).json({
                msg: "Password is required and must have at least 6 characters, at least one letter and one number."
            })
        }
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        const createdUser = await UserModel.create({
            ...req.body,
            passwordHash: hashedPassword
        })
        return res.status(201).json(createdUser)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
})

router.post("/login", async (req,res) => {
    try {
        const {email,password} = req.body
        const user = await UserModel.findOne({email:email})
        if(!user){
            return res.status(400).json({msg: "wrong password or e-mail"})
        }
        if(await bcrypt.compare(password, user.passwordHash)){
            delete user._doc.passwordHash
            const token = generateToken(user)
            return res.status(200).json({user:{...user._doc},token:token})
        }
        else{
            return res.status(401).json(error)
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
})
module.exports = router

