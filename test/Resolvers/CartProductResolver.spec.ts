import {Connection} from "typeorm";
import {User} from "../../src/entity/User";
import {connection} from "../test-utils/connection";
import {createUserHelper} from "../helper/createUserHelper";
import {createCartHelper} from "../helper/createCartHelper";
import {Product} from "../../src/entity/Product";
import {createProductHelper} from "../helper/createProductHelper";
import {createCartProductHelper} from "../helper/createCartProductHelper";
import {graphqlCall} from "../test-utils/graphqlCall";

describe("Test Address Resolver",  () => {
  let conn: Connection;
  let user: User;

  beforeAll(async () => {
    conn = await connection();
    user = await createUserHelper();
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Get Product From Cart", async () => {
    const cart = await createCartHelper(user);

    const products: Product[] = [];

    for(let i=0; i < 4; i++) {
      products.push(await createProductHelper());
      await createCartProductHelper(products[i], cart);
    }

    const getProductsFormCartQuery = `{
      getProductsFromCart(cartId: ${cart.id}) {
        product {
         id
        }
      }
    }`;

    const response = await graphqlCall({
      source: getProductsFormCartQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data: {
        getProductsFromCart: [{
          product: {
            id: `${products[0].id}`
          }
        },
        {
          product: {
            id: products[1].id.toString()
          }
        },
        {
          product: {
            id: products[2].id.toString()
          }
        },
        {
          product: {
            id: products[3].id.toString()
          }
        }]
      }
    })

  });
});
