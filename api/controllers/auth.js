import User from "../models/User.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
const createError = (status, message) => {
    const err = new Error();
    err.status = status
    err.message = message
    return err;
};

export const register = async (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    try {
        const newUser = new User({
           ...req.body,
            password: hash,
        })
        await newUser.save()
        res.status(200).json('User has been created')
    } catch (err) {
        next(err)
    }
}
export const login = async (req, res, next) => {
    try {
        //check if the user exists or not 
        const user = await User.findOne({ username: req.body.username })
        if (!user) return next(createError(404, "User not found!"))

        //check if the password is correct or not
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordCorrect) return next(createError(404, "Wrong username or password"))

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT);
        const { password, isAdmin, ...otherDetails } = user._doc;
        res.cookie("access_token", token, { httpOnly: true }).status(200).json({ ...otherDetails })
    } catch (err) {
        next(err)
    }
}

