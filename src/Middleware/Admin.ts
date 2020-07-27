import { MiddlewareFn } from "type-graphql";
import { ApiContext } from "../types/ApiContext";
import { User } from "../entity/User";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";

export const Admin: MiddlewareFn<ApiContext> = async (
  { context },
  next
): Promise<any> => {
  if (!context.req.session!.token) {
    throw new AuthenticationError("Not Authenticated");
  }

  const user = User.findOne(context.req.session!.token);

  if (!user) {
    throw new ForbiddenError("You didn't have access");
  }

  return next();
};
