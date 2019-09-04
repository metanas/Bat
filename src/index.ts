import "reflect-metadata";
import {createConnection} from "typeorm";
import cors from "cors";
import Express from "express";
import session from "express-session";
import {redis} from "./redis";
import connectRedis from "connect-redis";
import {createApolloServer} from "./server";
import {createApolloServerAdmin} from "./server/admin";

const main = async (): Promise<void> => {
  await createConnection();

  const apolloServer = await createApolloServer();

  const apolloServerAdmin = await createApolloServerAdmin();

  const app = Express();

  app.use(cors());

  const RedisStore = connectRedis(session);

  app.use(session({
    store: new RedisStore({
      client: redis as any
    }),
    name: "token",
    secret: "dev",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
    }
  }));

  apolloServer.applyMiddleware({
    app,
    path: "/api/graphql"
  });

  apolloServerAdmin.applyMiddleware({
    app,
    path: "/api/admin/graphql"
  });

  app.listen(4000, (): void => {
    console.log(`server started on http://www.localhost:4000${apolloServer.graphqlPath}`);
    console.log(`server admin started on http://www.localhost:4000${apolloServerAdmin.graphqlPath}`);
  });
};

main();
