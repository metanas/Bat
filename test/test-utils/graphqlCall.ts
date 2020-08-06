import { graphql, GraphQLSchema, ExecutionResult } from "graphql";
import { Maybe } from "type-graphql";
import { createSchema } from "../../src/utils/createSchema";
import { User } from "../../src/entity/User";
import { Costumer } from "../../src/entity/Costumer";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: unknown;
  }>;
  token?: string;
  user?: User | Costumer;
  isAdmin?: boolean;
}

let schema: GraphQLSchema;

export const graphqlCall = async ({
  source,
  variableValues,
  user,
  token,
  isAdmin,
}: Options): Promise<ExecutionResult> => {
  if (!schema) {
    schema = await createSchema(isAdmin);
  }

  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      res: {
        status: jest.fn(),
        clearCookie: jest.fn(),
        cookie: jest.fn(),
        set: jest.fn(),
        setHeader: jest.fn(),
      },
      user,
    },
  });
};
