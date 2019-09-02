import {Connection} from "typeorm";
import {connection} from "../../test-utils/connection";
import {User} from "../../../src/entity/User";
import {createUserHelper} from "../../helper/createUserHelper";
import {createUserGroupHelper} from "../../helper/createUserGroupHelper";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {truncate} from "../../helper/truncateTables";
import { take, slice } from "lodash";
import { GraphQLError } from "graphql";

describe("Test Address Resolver",  () => {
  let conn: Connection;
  let user: User;

  beforeAll(async () => {
    conn = await connection();
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Getting Get By ID", async () => {
    const userGroup = await createUserGroupHelper();
    user = await createUserHelper(userGroup);

    const getUserQuery = `{
      getUser(id: "${user.id}" ){
        name
        userGroup {
          name
        }
      }
    }` ;

    const response = await graphqlCall({
      source: getUserQuery,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        getUser: {
          name: user.name,
          userGroup: {
            name: userGroup.name
          }
        }
      }
    })
  });

  it("Test get User", async () => {
    await truncate(conn, "user");

    const userGroup = await createUserGroupHelper();
    const userList: {name: string}[] = [];

    for(let i=0; i < 30; i++) {
      user = await createUserHelper(userGroup);
      userList.push({name: user.name});
    }

    let getUsersQuery = `{
      getUsers(page: 1, limit: 12) {
        items {
          name
        }
        total_count
        total_pages
      }
    }`;

    let response = await graphqlCall({
      source: getUsersQuery,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        getUsers: {
          items: take(userList, 12),
          "total_pages": 3,
          "total_count": 30
        }
      }
    });

    getUsersQuery = `{
      getUsers(page: 2, limit: 12) {
        items {
          name
        }
        total_count
        total_pages
      }
    }`;

    response = await graphqlCall({
      source: getUsersQuery,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        getUsers: {
          items: slice(userList, 12, 24),
          "total_pages": 3,
          "total_count": 30
        }
      }
    });
  }, 10000);

  it("Test Add User", async () => {
    const userGroup = await createUserGroupHelper();

    const addUserQuery = `mutation {
      addUser(name: "user", password: "password", userGroupId: ${userGroup.id}){
        name
        userGroup {
          name
        }
      }
    }`;

    const response = await graphqlCall({
      source: addUserQuery,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        addUser: {
          name: "user",
          userGroup: {
            name: userGroup.name
          }
        }
      }
    });
  });

  it("Test login", async () => {
    const userGroup = await createUserGroupHelper();

    const user = await createUserHelper(userGroup, "TestPassword");
    const loginQuery = `mutation {
      login(name: "${user.name}", password: "TestPassword") {
        id 
        name
      }
    }`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await graphqlCall({
      source: loginQuery,
      isAdmin: true
    });


    expect(response).toMatchObject({
      data: {
        login: {
          id: user.id,
          name: user.name
        }
      }
    });
  });

  it("Test login when not register or password wrong", async () => {
    const userGroup = await createUserGroupHelper();

    await createUserHelper(userGroup, "TestPassword");
    let loginQuery = `mutation {
      login(name: "tttttt", password: "TestPassword") {
        id 
        name
      }
    }`;

    let response = await graphqlCall({
      source: loginQuery,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: null
    });

    loginQuery = `mutation {
      login(name: "user", password: "pppppppp") {
        id 
        name
      }
    }`;

    response = await graphqlCall({
      source: loginQuery,
      isAdmin: true
    });

    expect(response).toMatchObject({
      errors: [new GraphQLError("User and Password not register!")]
    })
  });

  it("Test delete User", async () => {
    const userGroup = await createUserGroupHelper();

    user = await createUserHelper(userGroup);

    const deleteUser = `mutation { 
      deleteUser(id: "${user.id}") 
    }`;

    const response = await graphqlCall({
      source: deleteUser,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        deleteUser: true
      }
    });

    const userExpect = await User.findOne(user.id);

    expect(userExpect).toBeUndefined()
  });
});
