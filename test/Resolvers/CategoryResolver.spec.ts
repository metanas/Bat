import {connection} from "../test-utils/connection";
import {Connection} from "typeorm";
import {Category} from "../../src/entity/Category";
import {graphqlCall} from "../test-utils/graphqlCall";
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
  // it("test Add Category", async () => {
  //   const addCategoryQuery = `mutation {
  //   addCategory(name: "snacks" ) {
  //   name}
  //   }`;
  //
  //   const response = await graphqlCall({
  //     source: addCategoryQuery});
  //
  //   expect(response).toMatchObject({
  //     data:{
  //       addCategory:{
  //         name:"snacks"
  //       }
  //     }
  //   })
  // });
  // it("Test Delete Category", async () => {
  //   const category = await Category.create({
  //     name: faker.name.findName(),
  //   }).save();
  //
  //   const deleteCategoryQuery = `mutation {
  //    deleteCategory(id: ${category.id})
  //   }`;
  //   const response = await graphqlCall({
  //     source: deleteCategoryQuery
  //   });
  //   expect(response).toMatchObject({
  //     data: {
  //       deleteCategory: true
  //     }
  //   });
  // });
  // it("Test Update Category", async() => {
  //
  //   const category = await Category.create({
  //     name: faker.name.findName(),
  //   }).save();
  //
  //
  //   const updateCategoryQuery = `mutation {
  //   updateCategory(id: ${category.id}, name: "${faker.name.findName()}"){
  //   id
  //   name}
  //   }`;
  //
  //   const response = await graphqlCall({
  //     source: updateCategoryQuery,
  //   });
  //
  //   expect(get(response.data,"updateCategory.id")).toEqual(`${category.id}`);
  //   expect(get(response.data,"updateCategory.name")).not.toEqual(category.name);
  //
  // });



});
