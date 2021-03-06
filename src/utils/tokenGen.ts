import { User } from "../entity/User";
import { sign } from "jsonwebtoken";
import "dotenv/config";

export const createAccessToken = (user: User): string => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET || "", {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (user: User): string => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRECH_TOKEN_SECRET || "",
    {
      expiresIn: "7d",
    }
  );
};
