import { buildSchema } from "type-graphql";
import { join } from "path";
import { Roles } from "../Middleware/Roles";
import { GraphQLSchema } from "graphql";

export const createSchema = (isAdmin = false): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [
      isAdmin
        ? join(__dirname + "/../../src/Resolvers/admin/*.ts")
        : join(__dirname + "/../../src/Resolvers/shared/*.ts"),
    ],
    authChecker: isAdmin ? Roles : undefined,
  });
};
