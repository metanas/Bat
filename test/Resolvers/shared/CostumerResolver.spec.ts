import { graphqlCall } from "../../test-utils/graphqlCall";
import { createCostumerHelper } from "../../helper/createCostumerHelper";
import { connection } from "../../test-utils/connection";
import { Connection } from "typeorm";
import { Costumer } from "../../../src/entity/Costumer";

let costumer: Costumer;
let conn: Connection;

beforeAll(async () => {
  conn = await connection();
  costumer = await createCostumerHelper();
});

afterAll(async () => {
  await conn.close();
});

describe("Me", () => {
  it("Test Get Costumer Authenticated", async () => {
    const meQuery = `{
      me {
        id
        name
        telephone
        status
        birthday
        avatar
      }
    }`;

    const response = await graphqlCall({
      source: meQuery,
      user: costumer,
    });

    expect(response).toMatchObject({
      data: {
        me: {
          id: `${costumer.id}`,
          name: costumer.name,
          telephone: costumer.telephone,
          status: false,
          birthday: costumer.birthday,
          avatar: null,
        },
      },
    });
  }, 30000);

  it("Test Register New Costumer", async () => {
    const registerQuery = `mutation { 
      register(data: {name: "test", telephone: "012-141-412", birthday: "01/02/1900" }) {
        name
        telephone
        birthday
      }
    }`;

    const response = await graphqlCall({
      source: registerQuery,
    });

    expect(response).toMatchObject({
      data: {
        register: {
          name: "test",
          telephone: "012-141-412",
          birthday: "01/02/1900",
        },
      },
    });
  });

  it("Test Login", async () => {
    const registerQuery = `mutation { 
      login(telephone: "${costumer.telephone}") {
        id
        name
        telephone
        birthday
      }
    }`;

    const response = await graphqlCall({
      source: registerQuery,
    });

    expect(response).toMatchObject({
      data: {
        login: {
          id: costumer.id.toString(),
          name: costumer.name,
          telephone: costumer.telephone,
          birthday: costumer.birthday,
        },
      },
    });
  }, 30000);

  it("Test Login With No Register Phone Number", async () => {
    const registerQuery = `mutation { 
      login(telephone: "123-244-295") {
        id
        name
        telephone
        birthday
      }
    }`;

    const response = await graphqlCall({
      source: registerQuery,
    });

    expect(response.data).toBeNull();
  }, 30000);
});
