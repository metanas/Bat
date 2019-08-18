import { graphql, GraphQLSchema } from "graphql";
import {Maybe} from "type-graphql";
import {createSchema} from "../../src/utils/createSchema";


interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  token?: string;
}

let schema: GraphQLSchema;

export const graphqlCall = async ({ source, variableValues, token }: Options) => {
  if(!schema) {
    schema = await createSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          token
        }
      },
      res: {
        clearCookie: jest.fn()
      }
    }
  });
};
