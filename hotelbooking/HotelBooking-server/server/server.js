import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectSupabaseStorage from "./configs/storage.js";
import roomRouter from "./routes/RoomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";


connectDB();
connectSupabaseStorage();

const app = express();
app.use(cors());


// Middleware
app.use(express.json());
app.use(clerkMiddleware());


app.use("/api/clerk", clerkWebhooks);


app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
