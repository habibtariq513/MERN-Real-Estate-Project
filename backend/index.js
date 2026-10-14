import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

let connectionPromise;

const connectToDatabase = () => {
    if (!process.env.MONGO) {
        return Promise.reject(new Error("MONGO environment variable is required"));
    }

    if (mongoose.connection.readyState === 1) {
        return Promise.resolve();
    }

    connectionPromise ??= mongoose.connect(process.env.MONGO).catch((error) => {
        connectionPromise = undefined;
        throw error;
    });

    return connectionPromise;
};

app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        next(error);
    }
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

export default app;
