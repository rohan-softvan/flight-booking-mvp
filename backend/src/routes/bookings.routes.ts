import { Router } from "express";
import { create } from "../controllers/bookings.controller";
import { asyncHandler } from "../utils/asyncHandler";

export const bookingsRouter = Router();

bookingsRouter.post("/bookings", asyncHandler(create));
