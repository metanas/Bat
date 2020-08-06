import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { join } from "path";
import { complexity } from "../utils/complexity";
import { last, set } from "lodash";

export const createApolloServer = async () => {
  const schema = await buildSchema({
    resolvers: [join(__dirname + "/../Resolvers/shared/*.ts")],
  });

  return new ApolloServer({
    schema,
    context: async ({ req, res }) => {
      const ctx = { req, res };
      const token = last(req.headers?.authorization?.split(" "));

      if (token) {
        try {
          set(ctx, "user", process.env.ACCESS_TOKEN_SECRET);
        } catch (e) {}
      }

      return ctx;
    },
    plugins: complexity(schema),
    uploads: false,
  });
};
