import { connection } from "../test-utils/connection";
import  { User } from "../../src/entity/User";
import faker from "faker";
import {graphqlCall} from "../test-utils/graphqlCall";
import {Connection} from "typeorm";

let conn: Connection;

beforeAll(async () => {
  conn = await connection();
});

afterAll(async () => {
  await conn.close();
});

const meQuery = `{
  me {
    id
    name
    telephone
    status
    birthday
    avatar
  }
}
`;

describe("Me", () => {
  it("get user", async () => {
    const user = await User.create({
      name: faker.name.firstName() + " " + faker.name.lastName(),
      telephone: faker.phone.phoneFormats(),
      birthday: faker.date.past(1990).toDateString()
    }).save();

    const response = await graphqlCall({
      source: meQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data: {
        me: {
          id: `${user.id}`,
          name: user.name,
          telephone: user.telephone,
          status: false,
          birthday: user.birthday,
          avatar: null
        }
      }
    })
  })
});
