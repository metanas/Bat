import {User} from "../../src/entity/User";
import {createUserHelper} from "../helper/createUserHelper";
import {connection} from "../test-utils/connection";
import {Connection} from "typeorm";
import {graphqlCall} from "../test-utils/graphqlCall";
import {Cart} from "../../src/entity/Cart";

describe("Test Cart Resolver",  () => {
  let conn: Connection;
  let user: User;

  beforeAll(async () => {
    conn = await connection();
    user = await createUserHelper();
  });

  afterAll(async () => {
    await conn.close();
  });
  it("Test Getting Cart By UserID", async () => {

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