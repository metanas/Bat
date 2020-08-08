import { Connection } from "typeorm";
import { Costumer } from "../../../src/entity/Costumer";
import { connection } from "../../test-utils/connection";
import { createCostumerHelper } from "../../helper/createCostumerHelper";
import { graphqlCall } from "../../test-utils/graphqlCall";
import { createOrderHelper } from "../../helper/createOrderHelper";
import { createAddressHelper } from "../../helper/createAddressHelper";
import { createUserGroupHelper } from "../../helper/createUserGroupHelper";
import { createUserHelper } from "../../helper/createUserHelper";
import { loginHelper } from "../../helper/loginHelper";
import { truncate } from "../../helper/truncateTables";
import { createDriverHelper } from "../../helper/createDriverHelper";
import { last } from "lodash";

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
  it("Test get Orders", async () => {
    const userGroup = await createUserGroupHelper();
    const admin = await createUserHelper(userGroup);

    const token = await loginHelper(admin);
    let driver = await createDriverHelper();

    await truncate(conn, "order");
    const orders = [];
    for (let i = 0; i < 20; i++) {
      const costumer = await createCostumerHelper();
      const address = await createAddressHelper(costumer);
      driver = await createDriverHelper();
      const order = await createOrderHelper(address, costumer, 10, driver);
      orders.push({ id: order.id });
    }
    let getOrderQuery = `{
      getOrders{
        items { 
          id 
        }
        total_count
    }}`;
    let response = await graphqlCall({
      source: getOrderQuery,
      user: admin,
      isAdmin: true,
      token,
    });

    expect(response.data).toMatchObject({
      getOrders: {
        items: orders,
        total_count: 20,
      },
    });
    getOrderQuery = `{
      getOrders(driverId : ${driver!.id}) {
        items { 
          id 
        }
        total_count
    }}`;
    response = await graphqlCall({
      source: getOrderQuery,
      user: admin,
      isAdmin: true,
      token,
    });
    expect(response.data).toMatchObject({
      getOrders: {
        items: [last(orders)],
        total_count: 1,
      },
    });
  });

  it("Test Update Order not found ", async () => {
    const userGroup = await createUserGroupHelper();
    const admin = await createUserHelper(userGroup);

    const token = await loginHelper(admin);

    const updateOrderStatusQuery = `mutation {
      updateOrderStatus(id: "1c4def3e-2744-418a-b285-fcca88ec3083", status: "Done") {
        id
        status
      }
    }`;

    const response = await graphqlCall({
      source: updateOrderStatusQuery,
      user: admin,
      isAdmin: true,
      token,
    });
    expect(response.errors).toMatchObject([new Error("Order not found")]);
  });

  it("Test getOrder", async () => {
    const userGroup = await createUserGroupHelper();
    const admin = await createUserHelper(userGroup);

    const token = await loginHelper(admin);
    const address = await createAddressHelper(user);
    const order = await createOrderHelper(address, user, 3);
    const getOrderQuery = `{
      getOrder(id: "${order.id}"){
      id
      status
      driverName
      address
      }
    }`;
    const response = await graphqlCall({
      source: getOrderQuery,
      user: admin,
      isAdmin: true,
      token,
    });
    expect(response).toMatchObject({
      data: {
        getOrder: {
          id: order.id.toString(),
          status: order.status,
          driverName: order.driverName,
          address: order.address,
        },
      },
    });
  });

  it("Test Update Order Status", async () => {
    const userGroup = await createUserGroupHelper();
    const admin = await createUserHelper(userGroup);

    const token = await loginHelper(admin);
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
      user: admin,
      isAdmin: true,
      token,
    });

    expect(response).toMatchObject({
      data: {
        updateOrderStatus: {
          id: order.id.toString(),
          status: "Done",
        },
      },
    });
  });
});
