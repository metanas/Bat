import "reflect-metadata";
import { createConnection } from "typeorm";
import { createApolloServer } from "./server";
import { createApolloServerAdmin } from "./server/admin";
import { InitServer } from "./server/rest";

const main = async (): Promise<void> => {
  await createConnection();

  const app = InitServer();

  const apolloServer = await createApolloServer();

  const apolloServerAdmin = await createApolloServerAdmin();

  apolloServer.applyMiddleware({
    app,
    path: "/api/graphql",
  });

  apolloServerAdmin.applyMiddleware({
    app,
    path: "/api/admin/graphql",
  });

  app.listen(4000, (): void => {
    console.log(
      `server started on http://www.localhost:4000${apolloServer.graphqlPath}`
    );
    console.log(
      `server admin started on http://www.localhost:4000${apolloServerAdmin.graphqlPath}`
    );
  });
};

main();
