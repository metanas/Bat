import { buildSchema } from "type-graphql";
import {join} from "path";

export const createSchema = (isAdmin: boolean=false) => {
  return buildSchema({
    resolvers: [(isAdmin) ? join(__dirname + "/../../src/Resolvers/admin/*.ts"): join(__dirname + "/../../src/Resolvers/shared/*.ts")]
  });
};
