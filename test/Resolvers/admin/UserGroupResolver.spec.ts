import {Connection} from "typeorm";
import {connection} from "../../test-utils/connection";
import {createUserGroupHelper} from "../../helper/createUserGroupHelper";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {UserGroup} from "../../../src/entity/UserGroup";
import {truncate} from "../../helper/truncateTables";

describe("Product Resolver Test", () => {
  let conn: Connection;

  beforeAll(async () => {
    conn = await connection();
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Get User Groups", async () => {
    await truncate(conn, "user_group");
    const userGroupsList: {id: number}[] = [];
    for(let i=0; i < 7; i++) {
      const userGroup = await createUserGroupHelper();
      userGroupsList.push({id: userGroup.id});
    }

    const getUserGroupQuery = `{
      getUserGroups(page:1, limit: 10) {
        items{
          id
        }
        total_pages
        total_count
      }
    }`;

    const response = await graphqlCall({
      source: getUserGroupQuery,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        getUserGroups: {
          items: userGroupsList,
          "total_pages": 1,
          "total_count": 7
        }
      }
    })
  });

  it("Test Add User Group", async () => {
    const addUserGroupQuery = `mutation {
      addUserGroup(name: "Test", permissions: "{\\"access\\" :[\\"control\\",\\"dashboard\\"],\\"modify\\":[]}")
      {
        name
      }
    }`;

    const response = await graphqlCall({
      source: addUserGroupQuery,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        addUserGroup: {
          name: "Test"
        }
      }
    });
  });

  it("Test Update User Group", async () => {
    const userGroup = await createUserGroupHelper();

    const updateUserGroupQuery = `mutation {
      updateUserGroup(id: ${userGroup.id}, name: "new Name", permissions: "{ \\"access\\":[\\"New Value\\", \\"Test Value\\"], \\"modify\\": [\\"New Permission\\", \\"Permission\\"]}") {
        name 
        permissions {
          access
          modify
        }
      }
    }`;

    const response = await graphqlCall({
      source: updateUserGroupQuery,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        updateUserGroup: {
          name: "new Name",
          permissions: {
            "access" :
              ["New Value", "Test Value"],
            "modify":
              ["New Permission", "Permission"]
          }
        }
      }
    });
  });

  it("Test Delete User Group", async () => {
    let userGroup = await createUserGroupHelper();
    for(let i=0; i < 3; i++) {
      userGroup = await createUserGroupHelper();
    }

    const deleteUserGroupQuery = `mutation {
      deleteUserGroup(id: ${userGroup.id})
    }`;

    const response = await graphqlCall({
      source: deleteUserGroupQuery,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        deleteUserGroup: true
      }
    });

    const resultExpect = await UserGroup.findOne(userGroup.id);

    expect(resultExpect).toBeUndefined()
  });
});
