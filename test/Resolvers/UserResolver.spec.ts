import { connection } from "../test-utils/connection";
import  { User } from "../../src/entity/User";
import faker from "faker";
import {graphqlCall} from "../test-utils/graphqlCall";
import {Connection} from "typeorm";

let conn: Connection;

beforeAll(async () => {
  conn = await connection();
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

    const user = await User.create({
      name: faker.name.firstName() + " " + faker.name.lastName(),
      telephone: faker.phone.phoneFormats(),
      birthday: faker.date.past(1990).toDateString()
    }).save();

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
    })
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
    })
  });

  it("Test Login", async () => {
    const user = await User.create({
      name: faker.name.firstName() + " " + faker.name.lastName(),
      telephone: faker.phone.phoneFormats(),
      birthday: faker.date.past(1990).toDateString()
    }).save();

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
    })
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
