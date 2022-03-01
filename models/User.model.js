const { disable } = require("express/lib/application")
const { default: mongoose } = require("mongoose")
const { Schema , model } = require("mongoose")

const userSchema = new Schema ({
    name:{type: String, required: true, trim: true, unique: true},
    email:{type: String, required: true, trim: true, unique: true, match:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/},
    passwordHash:{type: String, required: true},
    recipes: [{type:mongoose.Types.ObjectId, ref: "Recipes"}],
    isDisabled:{type:Boolean, required:true,default:false},
    disabledWhen:{type:Date}
})
UserModel = model("User", userSchema)
module.exports = UserModel