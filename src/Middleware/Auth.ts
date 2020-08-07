import { MiddlewareFn } from "type-graphql";
import { ApiContext } from "../types/ApiContext";
import { AuthenticationError } from "apollo-server-express";

export const Auth: MiddlewareFn<ApiContext> = async (
  { context },
  next
): Promise<unknown> => {
  if (!context.req.headers?.authorization) {
    throw new AuthenticationError("Not Authenticated");
  }
  return next();
};
