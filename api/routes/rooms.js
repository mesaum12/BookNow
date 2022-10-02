import express from "express"
import { createRoom, deleteRoom, getRoom, getRooms, updateRoom, updateRoomAvailability } from "../controllers/room.js";
import jwt from "jsonwebtoken"

export const createError = (status, message) => {
    const err = new Error();
    err.status = status
    err.message = message
    return err;
};
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
router.post("/:hotelid", verifyAdmin, createRoom)
//update
router.put("/:id", verifyAdmin, updateRoom)
//update the room numbers 
router.put("/availability/:id", updateRoomAvailability)
//delete the room having id of the hotel having hotelid
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom)
//get by id the room details with the given id
router.get("/:id", getRoom)
//get all rooms in all the hotels 
router.get("/", getRooms)


export default router