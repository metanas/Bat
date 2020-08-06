import { connection } from "../../test-utils/connection";
import { Connection } from "typeorm";
import { Category } from "../../../src/entity/Category";
import { graphqlCall } from "../../test-utils/graphqlCall";
import faker = require("faker");
import { get } from "lodash";
import { createUserHelper } from "../../helper/createUserHelper";
import { createUserGroupHelper } from "../../helper/createUserGroupHelper";
import { loginHelper } from "../../helper/loginHelper";

let conn: Connection;

beforeAll(async () => {
  conn = await connection();
});

afterAll(async () => {
  await conn.close();
});

describe("Test Category Resolver", () => {
  it("test Add Category", async () => {
    const userGroup = await createUserGroupHelper();
    const user = await createUserHelper(userGroup);

    const token = await loginHelper(user);

    const addCategoryQuery = `
    mutation {
      addCategory(name: "snacks" ) {
        name
       }
    }`;

    const response = await graphqlCall({
      source: addCategoryQuery,
      isAdmin: true,
      token,
      user,
    });

    expect(response).toMatchObject({
      data: {
        addCategory: {
          name: "snacks",
        },
      },
    });
  });

  it("Test Delete Category", async () => {
    const userGroup = await createUserGroupHelper();
    const user = await createUserHelper(userGroup);

    const token = await loginHelper(user);
    const category = await Category.create({
      name: faker.name.findName(),
    }).save();

    const deleteCategoryQuery = `mutation {
     deleteCategory(id: ${category.id})
    }`;
    const response = await graphqlCall({
      source: deleteCategoryQuery,
      isAdmin: true,
      user,
      token,
    });
    expect(response).toMatchObject({
      data: {
        deleteCategory: true,
      },
    });
  });
  it("Test Update Category", async () => {
    const category = await Category.create({
      name: faker.name.findName(),
    }).save();

    const updateCategoryQuery = `mutation {
    updateCategory(id: ${category.id}, name: "${faker.name.findName()}"){
        id
        name
      }
    }`;

    const response = await graphqlCall({
      source: updateCategoryQuery,
      isAdmin: true,
    });

    expect(get(response.data, "updateCategory.id")).toEqual(`${category.id}`);
    expect(get(response.data, "updateCategory.name")).not.toEqual(
      category.name
    );
  });
});
