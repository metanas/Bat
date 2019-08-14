import { Connection } from "typeorm";

export async function truncate(conn: Connection): Promise<void> {
  await conn.query("TRUNCATE \"user\" CASCADE");
  await conn.query("TRUNCATE \"address\" CASCADE");
  await conn.query("TRUNCATE \"product\" CASCADE");
  await conn.query("TRUNCATE \"category\" CASCADE");
}
