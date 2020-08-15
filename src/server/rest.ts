import Express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "../entity/User";
import { sendRefreshToken } from "../utils/sendRefreshToken";
import { createAccessToken, createRefreshToken } from "../utils/tokenGen";
import { graphqlUploadExpress } from "graphql-upload";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function InitServer() {
  const app = Express();

  app.use(
    cors({
      origin: "http://localhost:8080",
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  app.post(
    "/refresh_token",
    async (req: Request, res: Response): Promise<Response> => {
      const token = req.cookies.jid;

      if (!token) {
        return res.send({ success: false, accessToken: "" });
      }

      let payload: { user_id?: string; tokenVersion?: number } = {};

      try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET!) as Record<
          string,
          unknown
        >;
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
