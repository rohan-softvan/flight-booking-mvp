import { Router } from "express";
import { getById, search } from "../controllers/flights.controller";
import { asyncHandler } from "../utils/asyncHandler";

export const flightsRouter = Router();

flightsRouter.get("/flights/search", asyncHandler(search));
flightsRouter.get("/flights/:id", asyncHandler(getById));
