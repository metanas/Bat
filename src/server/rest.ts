import Express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "../entity/User";
import { sendRefreshToken } from "../utils/sendRefreshToken";
import { createAccessToken, createRefreshToken } from "../utils/tokenGen";

export function InitServer() {
  const app = Express();

  app.use(
    cors({
      origin: "http://localhost:8080",
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.post(
    "/refresh_token",
    async (req: Request, res: Response): Promise<Response> => {
      const token = req.cookies.jid;

      if (!token) {
        return res.send({ success: false, accessToken: "" });
      }

      let payload: any = null;

      try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
      } catch (err) {
        return res.send({ success: false, accessToken: "" });
      }

      const user = await User.findOne(payload.user_id);

      if (!user) {
        return res.send({ success: false, accessToken: "" });
      }

      if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ success: false, accessToken: "" });
      }

      sendRefreshToken(res, createRefreshToken(user));

      return res.send({ success: true, accessToken: createAccessToken(user) });
    }
  );

  return app;
}
