const express = require("express")
const app = express()
require("dotenv").config()
require("./config/db.config")()
const cors = require("cors")

app.use(express.json())
app.use(cors({ origin: process.env.REACT_APP_URL }))


const API_VERSION = "v1"

const userRouter = require("./routes/user.routes")
app.use(`/${API_VERSION}/users`, userRouter)

const recipeRouter = require("./routes/recipe.routes")
app.use(`/${API_VERSION}/recipes`, recipeRouter)


app.listen(Number(process.env.PORT), () => {
    console.log("Server UP! PORT: ", process.env.PORT)
})