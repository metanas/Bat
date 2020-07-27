import { buildSchema } from "type-graphql";
import { join } from "path";
import { Roles } from "../Middleware/Roles";

export const createSchema = (isAdmin = false) => {
  return buildSchema({
    resolvers: [
      isAdmin
        ? join(__dirname + "/../../src/Resolvers/admin/*.ts")
        : join(__dirname + "/../../src/Resolvers/shared/*.ts"),
    ],
    authChecker: isAdmin ? Roles : undefined,
  });
};
