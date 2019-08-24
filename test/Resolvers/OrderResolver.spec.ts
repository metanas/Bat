import {Connection} from "typeorm";
import {connection} from "../test-utils/connection";
import {User} from "../../src/entity/User";
import {createUserHelper} from "../helper/createUserHelper";
import {createAddressHelper} from "../helper/createAddressHelper";
import {graphqlCall} from "../test-utils/graphqlCall";
import {createOrderHelper} from "../helper/createOrderHelper";
import {createCartHelper} from "../helper/createCartHelper";
import {createCartProductHelper} from "../helper/createCartProductHelper";
import {CartProduct} from "../../src/entity/CartProduct";
import {createProductHelper} from "../helper/createProductHelper";

let conn: Connection;
let user: User;

beforeAll(async () => {
  conn = await connection();
  user = await createUserHelper();
});

afterAll(async () => {
  await conn.close();
});

describe("Test Order Resolver", () => {
  it("Test Get Order By ID", async () => {
    const address = await createAddressHelper(user);

    const order = await createOrderHelper(address, user, 3);

    const getOrderQuery = `{
      getOrder(id: ${order.id}) {
        address
        driver
        orderProducts {
          product {
            name
          }
          quantity
          price
        }
      }
    }`;

    const response = await graphqlCall({
      source: getOrderQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data: {
        getOrder: {
          address: address.address,
          driver: order.driver,
          orderProducts: [
            {
              product: {
                name: order.orderProducts[0]!.product.name
              },
              quantity: order.orderProducts[0].quantity,
              price: order.orderProducts[0].price
            },
            {
              product: {
                name: order.orderProducts[1]!.product.name
              },
              quantity: order.orderProducts[1].quantity,
              price: order.orderProducts[1].price
            },
            {
              product: {
                name: order.orderProducts[2]!.product.name
              },
              quantity: order.orderProducts[2].quantity,
              price: order.orderProducts[2].price
            }
          ]
        }
      }
    });
  });

  it("Test Add Order", async () => {
    const address = await createAddressHelper(user);

    const cart = await createCartHelper(user);

    const cartProduct: CartProduct[] = [];

    for(let i=0; i < 3; i++) {
      const product = await createProductHelper();
      cartProduct.push(await createCartProductHelper(product, cart));
    }

    const addOrderQuery = `mutation {
      addOrder(addressId: ${address.id}, driver: "test", status: "in progress"){
        address
        driver
        status
        orderProducts {
          product {
            id
            name
          }
          price
          quantity
        }
      }
    }`;

    const response = await graphqlCall({
      source: addOrderQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data: {
        addOrder: {
          address: address.address,
          driver: "test",
          status: "in progress",
          orderProducts: [
            {
              product: {
                id: cartProduct[0].product.id.toString(),
                name: cartProduct[0].product.name
              },
              price: cartProduct[0].product.priceUnit,
              quantity: cartProduct[0].quantity
            },
            {
              product: {
                id: cartProduct[1].product.id.toString(),
                name: cartProduct[1].product.name
              },
              price: cartProduct[1].product.priceUnit,
              quantity: cartProduct[1].quantity
            },
            {
              product: {
                id: cartProduct[2].product.id.toString(),
                name: cartProduct[2].product.name
              },
              price: cartProduct[2].product.priceUnit,
              quantity: cartProduct[2].quantity
            },
          ]
        }
      }
    })

  });
});
