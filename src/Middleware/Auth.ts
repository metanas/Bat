import { MiddlewareFn } from "type-graphql";
import {ApiContext} from "../types/ApiContext";

export const Auth: MiddlewareFn<ApiContext> = async ({ context }, next): Promise<any> => {
  console.log(context.req.session);
  if (!context.req.session!.token) {
    throw new Error("Not Authenticated");
  }
  return next();
};
