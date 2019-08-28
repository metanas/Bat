import {Connection} from "typeorm";
import {connection} from "../test-utils/connection";
import {Costumer} from "../../src/entity/Costumer";
import {createCostumerHelper} from "../helper/createCostumerHelper";
import {createAddressHelper} from "../helper/createAddressHelper";
import {graphqlCall} from "../test-utils/graphqlCall";
import {createOrderHelper} from "../helper/createOrderHelper";
import {createCartHelper} from "../helper/createCartHelper";
import {createCartProductHelper} from "../helper/createCartProductHelper";
import {CartProduct} from "../../src/entity/CartProduct";
import {createProductHelper} from "../helper/createProductHelper";
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
      token: costumer.id
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
    const address = await createAddressHelper(costumer);

    const cart = await createCartHelper(costumer);

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
      token: costumer.id
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
    });

  });

  // it("Test Update Order Status", async () => {
  //   const address = await createAddressHelper(costumer);
  //
  //   const order = await createOrderHelper(address, costumer, 3);
  //
  //   const updateOrderStatusQuery = `mutation {
  //     updateOrderStatus(id: ${order.id}, status: "Done") {
  //       id
  //       status
  //     }
  //   }`;
  //
  //   const response = await graphqlCall({
  //     source: updateOrderStatusQuery,
  //     token: costumer.id
  //   });
  //
  //   expect(response).toMatchObject({
  //     data: {
  //       updateOrderStatus: {
  //         id: order.id.toString(),
  //         status: "Done"
  //       }
  //     }
  //   });
  // });

  it("Test Get Orders Pagination", async () => {
    costumer = await createCostumerHelper();

    const orders: {id: string}[] = [];

    for (let i=0; i < 17; i++) {
      const address = await createAddressHelper(costumer);

      const order = await createOrderHelper(address, costumer, 3);

      orders.push({ id: order.id.toString() });
    }

    let getOrdersQuery = `{
      getOrders(data: { page: 1, limit: 7 }) {
        items {
          id
        }
        total_pages
        total_count
      }
    }`;


    let response = await graphqlCall({
      source: getOrdersQuery,
      token: costumer.id
    });

    expect(get(response.data, "getOrders.items")).toEqual(
      take(orders, 7)
    );
    expect(get(response.data, "getOrders.total_pages")).toEqual(3);
    expect(get(response.data, "getOrders.total_count")).toEqual(17);

    getOrdersQuery = `{
      getOrders(data: { page: 2, limit: 7 }) {
        items {
          id
        }
        total_pages
        total_count
      }
    }`;

    response = await graphqlCall({
      source: getOrdersQuery,
      token: costumer.id
    });

    expect(get(response.data, "getOrders.items")).toEqual(
      slice(orders, 7, 14)
    );
    expect(get(response.data, "getOrders.total_pages")).toEqual(3);
    expect(get(response.data, "getOrders.total_count")).toEqual(17);
  });
});
