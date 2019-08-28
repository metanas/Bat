import { Request, Response } from "express";
import { User } from "../entity/User";
import { Costumer } from "../entity/Costumer";

export interface ApiContext {
  req: Request;
  res: Response;
  user?: User | Costumer;
}
