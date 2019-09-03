import { graphql, GraphQLSchema } from "graphql";
import {Maybe} from "type-graphql";
import {createSchema} from "../../src/utils/createSchema";
import {User} from "../../src/entity/User";
import {Costumer} from "../../src/entity/Costumer";


interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  user?: User | Costumer;
  isAdmin?: boolean;
}

let schema: GraphQLSchema;

export const graphqlCall = async ({ source, variableValues, user, isAdmin }: Options) => {
  if(!schema) {
    schema = await createSchema(isAdmin);
  }
  const token = (user) ? user.id: undefined;
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          token,
          user
        }
      },
      res: {
        clearCookie: jest.fn()
      }
    }
  });
};
