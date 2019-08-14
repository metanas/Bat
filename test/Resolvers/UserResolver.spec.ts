import {graphqlCall} from "../test-utils/graphqlCall";
import {createUserHelper} from "../helper/createUserHelper";
import {connection} from "../test-utils/connection";
import {Connection} from "typeorm";
import {User} from "../../src/entity/User";

let user: User;
let conn: Connection;

beforeAll(async () => {
  conn = await connection();
  user = await createUserHelper();
});

afterAll(async () => {
  await conn.close();
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
  }, 30000);

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
  }, 30000);

  it("Test Login", async () => {
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
      token: undefined
    });

    expect(response.data).toBeNull();
  }, 30000);
});
