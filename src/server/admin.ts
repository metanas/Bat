import { join } from "path";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Roles } from "../Middleware/Roles";
import { complexity } from "../utils/complexity";
import { last, set } from "lodash";

export const createApolloServerAdmin = async (): Promise<ApolloServer> => {
  const schemaAdmin = await buildSchema({
    resolvers: [join(__dirname + "/../Resolvers/admin/*.ts")],
    authChecker: Roles,
  });

  return new ApolloServer({
    schema: schemaAdmin,
    uploads: false,
    context: async ({ req, res }): Promise<Record<string, unknown>> => {
      const ctx = { req, res };
      const token = last(req.headers?.authorization?.split(" "));

      if (token) {
        try {
          set(ctx, "user", process.env.ACCESS_TOKEN_SECRET);
        } catch (e) {}
      }

      return ctx;
    },
    plugins: complexity(schemaAdmin),
  });
};
