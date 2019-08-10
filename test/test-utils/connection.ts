import { createConnection } from "typeorm";

export const connection = (drop: boolean = false) => {
  return createConnection({
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "project",
    database: "project-api",
    password: "root",
    synchronize: drop,
    logging: false,
    dropSchema: drop,
    entities: [__dirname + "/../../src/entity/*.ts"],
    cli: {
      entitiesDir: "/../../src/entity/*.ts"
    }
  })
};
