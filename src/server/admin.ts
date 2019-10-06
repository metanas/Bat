import {join} from "path";
import {ApolloServer} from "apollo-server-express";
// import isAuthorized from "../utils/authorizationChecker";
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
      return { req, res }
    },
    plugins: complexity(schemaAdmin),
  });
};
