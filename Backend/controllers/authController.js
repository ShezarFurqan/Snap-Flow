import jwt from "jsonwebtoken"
import userModel from "../models/usermodel.js"
import validator from "validator"
import bcrypt from "bcrypt"

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" })
}

export const Register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const exist = await userModel.findOne({ email })
        if (exist) {
            return res.json({ success: false, message: "User Already exists" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({ username, email, password: hashedPassword })
        const user = await newUser.save()

        const token = createToken(user._id)

        return res.json({ success: true, token, user: { username: user.username, _id: user._id } })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect password" })
        }

        const token = createToken(user._id)
        return res.json({ success: true, token, user: { username: user.username, _id: user._id } })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

