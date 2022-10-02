import express from "express"
import jwt from "jsonwebtoken";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.js"
const createError = (status, message) => {
    const err = new Error();
    err.status = status
    err.message = message
    return err;
};


const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    //if not token 
    if (!token) {
        return next(createError(401, "You are not authenticated"))
    }
    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));
        req.user = user;
        next()
    })

}

const verifyUser = (req, res, next) => {
    verifyToken(req, res,next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }
        else
            return next(createError(403, "You are not authorized!"));
    });
}
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res,next,() => {
        if (req.user.isAdmin) {
            next();
        }
        else
            return next(createError(403, "You are not authorized!"));
    });
}


const router = express.Router()

//update
router.put("/:id",verifyUser, updateUser)
//delete
router.delete("/:id",verifyUser, deleteUser)
//get by id
router.get("/:id",verifyUser, getUser)

//get all users
router.get("/",verifyAdmin, getUsers)

export default router