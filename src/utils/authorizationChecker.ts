import dotenv from "dotenv";

dotenv.config();

export default function isAuthorized(token: string): boolean {
  return process.env.HEADER_AUTHORIZATION === token.split(" ")[1];
}
