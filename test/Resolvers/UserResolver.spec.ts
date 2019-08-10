import {connection} from "../test-utils/connection";
import {graphqlCall} from "../test-utils/graphqlCall";
import {Connection} from "typeorm";
import {createUserHelper} from "../helper/createUserHelper";
import {truncate} from "../helper/truncateTables";

let conn: Connection;

beforeAll(async () => {
  conn = await connection();
});

afterAll(async () => {
  await conn.close();
});

beforeEach(async () => {
  await truncate(conn);
});

describe("Me", () => {
  it("Test Get User Authenticated", async () => {
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

    const user = await createUserHelper();

    const response = await graphqlCall({
      source: meQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data: {
        me: {
          id: `${user.id}`,
          name: user.name,
          telephone: user.telephone,
          status: false,
          birthday: user.birthday,
          avatar: null
        }
      }
    });
  });

  it("Test Register New User", async () => {
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
        }
      }
    });
  });

  it("Test Login", async () => {
    const user = await createUserHelper();

    const registerQuery = `mutation { 
      login(telephone: "${user.telephone}") {
        id
        name
        telephone
        birthday
      }
    }`;


    const response = await graphqlCall({
      source: registerQuery,
      token: undefined
    });

    expect(response).toMatchObject({
      data: {
        login: {
          id: user.id.toString(),
          name: user.name,
          telephone: user.telephone,
          birthday: user.birthday,
        }
      }
    });
  });

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
      token: undefined
    });

    expect(response.data).toBeNull();
  });
});
