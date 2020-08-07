import { Request, Response } from "express";
import { User } from "../entity/User";

export interface ApiContext {
  req: Request;
  res: Response;
  user?: User;
}
