const mongoose = require("mongoose")
const { Schema , model } = require("mongoose")

const recipeSchema = new Schema ({
    name: {type: String},
    ingredients: {type: Array},
    instructions: {type: String},
})
Recipemodel = model("Recipe", recipeSchema)
module.exports = Recipemodel