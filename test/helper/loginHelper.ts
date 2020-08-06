import { User } from "../../src/entity/User";
import { sign } from "jsonwebtoken";
import "dotenv/config";

export async function loginHelper(admin: User): Promise<string> {
  return sign(
    { ...admin },
    process.env.ACCESS_TOKEN_SECRET || "ACCESS_TOKEN_SECRET"
  );
}
