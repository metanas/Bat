import { MiddlewareFn } from "type-graphql";
import { ApiContext } from "../types/ApiContext";
import { User } from "../entity/User";
import { AuthenticationError } from "apollo-server-express";

export const Admin: MiddlewareFn<ApiContext> = async (
  { context },
  next
): Promise<unknown> => {
  try {
    await User.findOneOrFail({
      where: {
        id: context.user?.id,
      },
    });
  } catch (e) {
    throw new AuthenticationError("Not Authorized");
  }

  return next();
};
