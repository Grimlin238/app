const express = require("express")
const userRouter = express.Router()

userRouter.get("/", (req, res) => {
    res.send("<h1> User Profile Page </h1>")
})

userRouter.get("/matches", (req, res) =>{
    res.send("<h1> Match History </h1>")
})

module.exports = userRouter