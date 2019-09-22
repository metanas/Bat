import {join} from "path";
import {ApolloServer, ForbiddenError} from "apollo-server-express";
import isAuthorized from "../utils/authorizationChecker";
import {buildSchema} from "type-graphql";
import {Roles} from "../Middleware/Roles";
import {complexity} from "../utils/complexity";


export const createApolloServerAdmin = async () => {
  const schemaAdmin = await buildSchema({
    resolvers: [ join(__dirname + "/../Resolvers/admin/*.ts")],
    authChecker: Roles
  });

  return new ApolloServer({
    schema: schemaAdmin,
    context: async ({req, res}) => {
      const token = req.headers.authorization || "";

      if (!isAuthorized(token)) {
        throw new ForbiddenError("Permission denied!");
      }

      return { req, res }
    },
    plugins: complexity(schemaAdmin),
  });
};
