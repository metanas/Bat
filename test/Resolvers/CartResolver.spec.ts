import {User} from "../../src/entity/User";
import {Connection} from "typeorm";
import {connection} from "../test-utils/connection";
import faker = require("faker");
import {Cart} from "../../src/entity/Cart";
import {graphqlCall} from "../test-utils/graphqlCall";



let conn: Connection;
let user: User;

beforeAll(async () => {
  conn = await connection();
});

afterAll(async () => {
  await conn.close();
});

async function createUser() {
  user = await User.create({
    name: faker.name.firstName() + " " + faker.name.lastName(),
    telephone: faker.phone.phoneFormats(),
    birthday: faker.date.past().toDateString()
  }).save();
}

describe("Test Cart Resolver",  () => {
  it("Test Getting Cart By UserID", async () => {
    await createUser();

    const cart = await Cart.create({
      user: user
    }).save();

    const getCartQuery = `{
      getCart {
        id
      }
    }`;

    const response = await graphqlCall({
      source: getCartQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data:{
        getCart : {
          id: `${cart.id}`
        }
      }
    });
  });
});
