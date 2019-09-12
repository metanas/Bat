import {Connection} from "typeorm";
import {connection} from "../../test-utils/connection";
import {Costumer} from "../../../src/entity/Costumer";
import {createCostumerHelper} from "../../helper/createCostumerHelper";
import {createAddressHelper} from "../../helper/createAddressHelper";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {createOrderHelper} from "../../helper/createOrderHelper";
import {createCartHelper} from "../../helper/createCartHelper";
import {createCartProductHelper} from "../../helper/createCartProductHelper";
import {CartProduct} from "../../../src/entity/CartProduct";
import {createProductHelper} from "../../helper/createProductHelper";
import {get, slice, take} from "lodash";

let conn: Connection;
let costumer: Costumer;

beforeAll(async () => {
  conn = await connection();
  costumer = await createCostumerHelper();
});

afterAll(async () => {
  await conn.close();
});

describe("Test Order Resolver", () => {
  it("Test Get Order By ID", async () => {
    const address = await createAddressHelper(costumer);

    const order = await createOrderHelper(address, costumer, 3);

    const getOrderQuery = `{
      getOrder(id: ${order.id}) {
        address
        driverName
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
      user: costumer
    });

    expect(response).toMatchObject({
      data: {
        getOrder: {
          address: address.address,
          driverName: order.driverName,
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
    const address = await createAddressHelper(costumer);

    const cart = await createCartHelper(costumer);

    const cartProduct: CartProduct[] = [];

    for(let i=0; i < 3; i++) {
      const product = await createProductHelper();
      cartProduct.push(await createCartProductHelper(product, cart));
    }

    const addOrderQuery = `mutation {
      addOrder(addressId: ${address.id}){
        address
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
      user: costumer
    });

    expect(response).toMatchObject({
      data: {
        addOrder: {
          address: address.address,
          status: "In Progress",
          orderProducts: [
            {
              product: {
                id: cartProduct[0].product.id.toString(),
                name: cartProduct[0].product.name
              },
              price: cartProduct[0].product.priceCent,
              quantity: cartProduct[0].quantity
            },
            {
              product: {
                id: cartProduct[1].product.id.toString(),
                name: cartProduct[1].product.name
              },
              price: cartProduct[1].product.priceCent,
              quantity: cartProduct[1].quantity
            },
            {
              product: {
                id: cartProduct[2].product.id.toString(),
                name: cartProduct[2].product.name
              },
              price: cartProduct[2].product.priceCent,
              quantity: cartProduct[2].quantity
            },
          ]
        }
      }
    });

  });

  it("Test Get Orders Pagination", async () => {
    costumer = await createCostumerHelper();

    let orders: {id: string}[] = [];

    for (let i=0; i < 17; i++) {
      const address = await createAddressHelper(costumer);

      const order = await createOrderHelper(address, costumer, 3);

      orders.push({ id: order.id.toString() });
    }

    orders = orders.reverse();

    let getOrdersQuery = `{
      getOrders( page: 1, limit: 7 ) {
        items {
          id
        }
        total_pages
        total_count
      }
    }`;


    let response = await graphqlCall({
      source: getOrdersQuery,
      user: costumer
    });

    expect(get(response.data, "getOrders.items")).toEqual(
      take(orders, 7)
    );
    expect(get(response.data, "getOrders.total_pages")).toEqual(3);
    expect(get(response.data, "getOrders.total_count")).toEqual(17);

    getOrdersQuery = `{
      getOrders( page: 2, limit: 7 ) {
        items {
          id
        }
        total_pages
        total_count
      }
    }`;

    response = await graphqlCall({
      source: getOrdersQuery,
      user: costumer
    });

    expect(get(response.data, "getOrders.items")).toEqual(
      slice(orders, 7, 14)
    );
    expect(get(response.data, "getOrders.total_pages")).toEqual(3);
    expect(get(response.data, "getOrders.total_count")).toEqual(17);
  });
});
