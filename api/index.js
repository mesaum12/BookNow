import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js"
import usersRouter from "./routes/users.js"
import hotelsRouter from "./routes/hotels.js"
import roomsRouter from "./routes/rooms.js"
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express()

dotenv.config()
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        console.log('connected to mongo');
    } catch (error) {
        throw (error)
    }
};

mongoose.connection.on('connected', () => {
    console.log('connected');
})

//creating a middleware for this 

app.use(cors())
app.use(cookieParser())
app.use(express.json())


app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/rooms", roomsRouter);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    });
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    connect()
    console.log('Server is listening ');
})
