import {GraphQLRequestContext} from "apollo-server-types";
import {fieldExtensionsEstimator, getComplexity, simpleEstimator} from "graphql-query-complexity";
import {separateOperations, GraphQLSchema} from "graphql";

export function complexity(schema: GraphQLSchema) {
  return [{ requestDidStart: () => ({
    didResolveOperation({ request, document }: GraphQLRequestContext) {
      const complexity = getComplexity({
        schema,
        query: request.operationName ? separateOperations(document!)[request.operationName] : document!,
        variables: request.variables,
        estimators: [
          fieldExtensionsEstimator(),
          simpleEstimator({defaultComplexity: 1}),
        ]
      });
      if (complexity >= 20) {
        throw new Error(
          `Sorry, too complicated query! ${complexity} is over 10 that is the max allowed complexity.`,
        );
      }
    }
  })
  }
  ];
}
