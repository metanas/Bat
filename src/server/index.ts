import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {join} from "path";
import {complexity} from "../utils/complexity";

export const createApolloServer = async () => {
  const schema = await buildSchema({resolvers: [ join(__dirname + "/../Resolvers/shared/*.ts") ]});

  return new ApolloServer({
    schema,
    context: ({req, res}) => ({req, res}),
    plugins: complexity(schema)
  });
};
