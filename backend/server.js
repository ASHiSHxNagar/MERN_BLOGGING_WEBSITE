import express from 'express'
import mongoose from 'mongoose';
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid';
const app = express();


//schema below
import User from './Schema/User.js'

let PORT = 3000

mongoose.connect(process.env.MONGO_URI, {
    autoIndex: true
})

const generateUsername = async (email) => {
    let username = email.split("@")[0]

    let usernameExists = await User.exists({ "personal_info.username": username }).then((result) => result)
    usernameExists ? username+= nanoid().substring(0, 5) : ""

    return username

}

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

app.use(express.json())


app.post("/signup", (req, res) => {
    let { fullname, email, password } = req.body
    //validating data from frontend
    if (fullname.length < 3) {
        return res.status(403).json({ "error": "Fullname must be 3 letters long" })
    }
    if (!email.length) {
        return req.status(403).json({ "error": "Enter Email" })
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": " Email is Invalid" })
    }
    if (!passwordRegex.test(password)) {
        res.status(403).json({ "error": "Password should be 6 to 20 characters long with numeric, 1 lowercase and 1 uppercase letters" })
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {

        let username = await generateUsername(email)

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        })

        user.save().then((u) => {
            return res.status(200).json({ user: u })
        }).catch(err => {
            if (err.code == 11000) {
                return res.status(500).json({ "error": "Email already exists" })
            }
            return res.status(500).json({ "error": err.message })
        })
    })


})


app.listen(PORT, (req, res) => {
    console.log('listning at port ', PORT)
})