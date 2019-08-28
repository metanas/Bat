import {Costumer} from "../../src/entity/Costumer";
import {createCostumerHelper} from "../helper/createCostumerHelper";
import {connection} from "../test-utils/connection";
import {Connection} from "typeorm";
import {graphqlCall} from "../test-utils/graphqlCall";
import {Cart} from "../../src/entity/Cart";


describe("Test Cart Resolver",  () => {
  let conn: Connection;
  let costumer: Costumer;

  beforeAll(async () => {
    conn = await connection();
    costumer = await createCostumerHelper();
  });

  afterAll(async () => {
    await conn.close();
  });
  it("Test Getting Cart By CostumerID", async () => {

    const cart = await Cart.create({
      costumer: costumer
    }).save();

    const getCartQuery = `{
      getCart {
      id
      }
    }`;

    const response = await graphqlCall({
      source: getCartQuery,
      token: costumer.id
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