import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities, createOrUpdateUser, updateUserRole } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", protect, getUserData);
userRouter.post("/store-recent-search", protect, storeRecentSearchedCities);
userRouter.post("/create-or-update", createOrUpdateUser);
userRouter.put("/update-role", protect, updateUserRole);

export default userRouter;
