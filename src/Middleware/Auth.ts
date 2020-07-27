import { MiddlewareFn } from "type-graphql";
import { ApiContext } from "../types/ApiContext";
import { AuthenticationError } from "apollo-server-express";

export const Auth: MiddlewareFn<ApiContext> = async (
  { context },
  next
): Promise<any> => {
  if (!context.req.session!.token) {
    throw new AuthenticationError("Not Authenticated");
  }
  return next();
};
