import express from "express"
import { createHotel, deleteHotel, getHotels, updateHotel, getHotel, countByCity, countByType, getHotelRooms } from "../controllers/hotel.js";
import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
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
const createError = (status, message) => {
    const err = new Error();
    err.status = status
    err.message = message
    return err;
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.isAdmin) {
            next();
        }
        else
            return next(createError(403, "You are not authorized!"));
    });
}

const router = express.Router()

//create
router.post("/", verifyAdmin, createHotel)
//update
router.put("/:id", verifyAdmin, updateHotel)
//delete
router.delete("/:id", verifyAdmin, deleteHotel)
//get by id
router.get("/find/:id", getHotel)
//get all hotels
router.get("/", getHotels)
//count by city
router.get("/countByCity", countByCity)
//count by type
router.get("/countByType", countByType)
//get hotel rooms for a given hotel id
router.get("/room/:id", getHotelRooms)

export default router