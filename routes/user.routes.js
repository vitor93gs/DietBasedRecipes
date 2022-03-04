const router = require("express").Router()
const bcrypt = require("bcrypt")

const generateToken = require("../config/jwt.config")
const UserModel = require("../models/User.model")
const isAuthenticated = require("../middlewares/isAuthenticated")
const attachCurrentUser = require("../middlewares/attachCurrentUser")
const checkDisabled = require("../utilities/checkDisabled")

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
        const response = createdUser
        response.passwordHash = ""
        return res.status(201).json(response)
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
            return res.status(400).json({msg:"Wrong password or e-mail"})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
})

router.get("/profile", isAuthenticated,attachCurrentUser,  async (req,res) =>{
    try {
        const loggedInUser = await req.currentUser
        if(!(await checkDisabled(UserModel,loggedInUser))){
            return res.status(400).json({msg: "Current user is disabled"})
        }
        if(loggedInUser){
            return res.status(200).json(loggedInUser)
        }
        else{
            return res.status(404).json({msg: "User not found"})
        } 
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
})

router.patch("/profile/update", isAuthenticated, attachCurrentUser, async(req,res) => {
    try {
        const user = req.currentUser
        if(!(await checkDisabled(UserModel,user))){
            return res.status(400).json({msg: "Current user is disabled"})
        }
        const updatedUser = await UserModel.findOneAndUpdate({ _id : user._id },{ ...req.body }, { new: true, runValidators: true })
        var show = updatedUser
        delete show._doc.passwordHash
        return res.status(200).json(show)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
})

router.patch("/profile/delete", isAuthenticated, attachCurrentUser, async(req,res) =>{
    try {
        const user = req.currentUser
        const updatedUser = await UserModel.findOneAndUpdate({ _id : user._id },{ isDisabled:true }, { new: true, runValidators: true })
        return res.status(200).json(updatedUser)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
})
module.exports = router

