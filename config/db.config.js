const mongoose = require("mongoose")
require("dotenv").config()
module.exports =  async function connect(){
    try {
        const dbConnection = await mongoose.connect("mongodb+srv://vitorsantos:XtMuctDg3GPgG6VN@diet-based-recipes-db.hjbtp.mongodb.net/diet-based-recipes-db?retryWrites=true")
        console.log("Connected to DB: ", dbConnection.connection.name)
    } catch (error) {
        console.error("DB connection error ", error)
    }
}