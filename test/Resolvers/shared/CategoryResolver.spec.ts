import {connection} from "../../test-utils/connection";
import {Connection} from "typeorm";
import {Category} from "../../../src/entity/Category";
import {graphqlCall} from "../../test-utils/graphqlCall";
import faker = require("faker");


let conn: Connection;

beforeAll(async () => {
  conn = await connection();
});

afterAll(async () => {
  await conn.close();
});


describe("Test Category Resolver",  () => {
  it("Test Getting Category By ID", async () => {

    const category = await Category.create({
      name: faker.name.findName(),
    }).save();

    const getCategoryQuery = `{
    getCategory(id: ${category.id}){
    id
    name
    }
    
    }`;

    const response = await graphqlCall({
      source: getCategoryQuery,
    });
    expect(response).toMatchObject({
      data:{
        getCategory:{
          id: `${category.id}`,
          name: category.name,
        }
      }
    })
  });
});
