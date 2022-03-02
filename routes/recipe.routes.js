const router = require("express").Router()
const { route } = require("express/lib/router")
const Recipemodel = require("../models/Recipe.model")
const UserModel = require("../models/User.model")
const isAuthenticated = require("../middlewares/isAuthenticated")
const attachCurrentUser = require("../middlewares/attachCurrentUser")
const checkDisabled = require("../utilities/checkDisabled")
const res = require("express/lib/response")

router.patch("/makeFavorite/:id", isAuthenticated , attachCurrentUser, async (req,res) => {
    try {
        const user = await req.currentUser
        if(!(await checkDisabled(UserModel,user))){
            return res.status(400).json({msg: "Current user is disabled"})
        }
        const id = req.params.id
        const favRecipe = await Recipemodel.findOne({_id:id})
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id : user._id },
            {$push : {favoriteRecipes: favRecipe}},
            {new:true, runValidators:true}
            ).populate("favoriteRecipes")
        return res.status(200).json(updatedUser)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
})

router.post("/newRecipe", async (req,res) => {
    try {
        const newRecipe = await Recipemodel.create({
            ...req.body
        }) 
        return res.status(200).json(newRecipe)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
})

router.get("/get", async (req,res) => {
    try {
        const id = req.body._id
        const foundRecipe = await Recipemodel.findOne({_id : id})
        return res.status(200).json(foundRecipe)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
})

router.patch("/delete", async (req,res) => {
    try {
        const deletedRecipe = await Recipemodel.findOneAndDelete({_id: req.body._id})
        return res.status(200).json({msg : "Recipe deleted."})
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
})

router.get("/findAll", async (req,res) => {
    try {
        const arrFound = await Recipemodel.find({name: {"$regex": req.body.name, "$options" : "i"}})
        return res.status(200).json(arrFound)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
})
router.patch("/update/:id", async (req,res) => {
    try {
        
        const updatedRecipe = await Recipemodel.findOneAndUpdate({_id : req.params.id},{...req.body},{new:true,runValidators: true })
        return res.status(200).json(updatedRecipe)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
})
module.exports = router