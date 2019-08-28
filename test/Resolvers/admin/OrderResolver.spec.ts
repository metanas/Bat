import {Connection} from "typeorm";
import {Costumer} from "../../../src/entity/Costumer";
import {connection} from "../../test-utils/connection";
import {createCostumerHelper} from "../../helper/createCostumerHelper";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {createOrderHelper} from "../../helper/createOrderHelper";
import {createAddressHelper} from "../../helper/createAddressHelper";

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
      updateOrderStatus(id: ${order.id}, status: "Done") {
        id
        status
      }
    }`;

    const response = await graphqlCall({
      source: updateOrderStatusQuery,
      token: user.id,
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
});