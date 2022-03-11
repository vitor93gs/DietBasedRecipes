const mongoose = require("mongoose")
require("dotenv").config()
module.exports =  async function connect(){
    try {
        const dbConnection = await mongoose.connect(process.env.mongoDB_URI)
        console.log("Connected to DB: ", dbConnection.connection.name)
    } catch (error) {
        console.error("DB connection error ", error)
    }
}