import { Router } from "express";
import { getAirports } from "../controllers/airports.controller";
import { asyncHandler } from "../utils/asyncHandler";

export const airportsRouter = Router();

airportsRouter.get("/airports", asyncHandler(getAirports));
