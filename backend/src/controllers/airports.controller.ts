import { Request, Response } from "express";
import { listAirports } from "../services/flightService";

export async function getAirports(_req: Request, res: Response): Promise<void> {
  const airports = await listAirports();
  res.json({ airports });
}
