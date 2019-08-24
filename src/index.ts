import "reflect-metadata";
import {createConnection} from "typeorm";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import cors from "cors";
import {join} from "path";
import Express from "express";
import session from "express-session";
import {redis} from "./redis";
import connectRedis = require("connect-redis");

const main = async (): Promise<void> => {
  await createConnection();

  const schema = await buildSchema({resolvers: [ join(__dirname + "/Resolvers/*.ts") ]});

  const apolloServer = new ApolloServer({
    schema, context: ({req, res}) => ({req, res})
  });

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

  apolloServer.applyMiddleware({app});

  app.listen(4000, (): void => {
    console.log("server started on http://www.localhost:4000/graphql");
  });
};

main();
