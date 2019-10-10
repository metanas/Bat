import {Connection} from "typeorm";
import {Costumer} from "../../../src/entity/Costumer";
import {connection} from "../../test-utils/connection";
import {createCostumerHelper} from "../../helper/createCostumerHelper";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {createOrderHelper} from "../../helper/createOrderHelper";
import {createAddressHelper} from "../../helper/createAddressHelper";
import {truncate} from "../../helper/truncateTables";
import { take } from "lodash";

let conn: Connection;
let user: Costumer;

beforeAll(async () => {
  conn = await connection();
  user = await createCostumerHelper();
});

afterAll(async () => {
  await conn.close();
});

describe("Test Order Resolver", () => {
  it("Test Update Order Status", async () => {
    const address = await createAddressHelper(user);

    const order = await createOrderHelper(address, user, 3);

    const updateOrderStatusQuery = `mutation {
      updateOrderStatus(id: "${order.id}", status: "Done") {
        id
        status
      }
    }`;

    const response = await graphqlCall({
      source: updateOrderStatusQuery,
      user: user,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        updateOrderStatus: {
          id: order.id.toString(),
          status: "Done"
        }
      }
    });
  });

  it("Test Get Order", async () => {
    const costumer = await createCostumerHelper();
    const address = await createAddressHelper(costumer);
    const order = await createOrderHelper(address, costumer, 3);

    const getOrderQuery = `{
      getOrder(id: "${order.id}") {
        address
      }
    }`;

    const response = await graphqlCall({
      source: getOrderQuery,
      user,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        getOrder: {
          address: address.address
        }
      }
    })
  });

  it("Test Get Orders", async () => {
    await truncate(conn, "order");
    const costumer = await createCostumerHelper();
    const address = await createAddressHelper(costumer);
    let orders: {id: string}[] = [];

    for (let i=0; i < 10; i++) {
      const order = await createOrderHelper(address, costumer, 2);
      orders.push({id: order.id });
    }

    orders = orders.reverse();

    const getOrdersQuery = `{
      getOrders(limit: 3) {
        items {
          id
        }
      }
    }`;

    const response = await graphqlCall({
      source: getOrdersQuery,
      isAdmin: true,
      user
    });

    expect(response).toMatchObject({
      data: {
        getOrders: {
          items: take(orders, 3)
        }
      }
    });


  });
});
