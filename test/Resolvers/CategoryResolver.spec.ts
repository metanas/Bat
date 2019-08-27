import {connection} from "../test-utils/connection";
import {Connection} from "typeorm";
import {Category} from "../../src/entity/Category";
import {graphqlCall} from "../test-utils/graphqlCall";
import faker = require("faker");
import {User} from "../../src/entity/User";
import {createCategoryHelper} from "../helper/createCategoryHelper";
import {  slice, take } from "lodash";
import {truncate} from "../helper/truncateTables";
import {createUserHelper} from "../helper/createUserHelper";






describe("Test Category Resolver",  () => {
  let category: Category;
  let user: User;
  let conn: Connection;

  beforeAll(async () => {
    conn = await connection();
    user = await createUserHelper();
  });

  afterAll(async () => {
    await conn.close();
  });

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
  it("Test Get Categories", async () => {
    await truncate(conn, "category");

    const categoryList: { id: string }[] = [];

    for(let i = 0; i < 12; i++){
      category = await createCategoryHelper();
      categoryList.push({ id: `${category.id}` });
    }
    let getCategoriesQuery = `{
      getCategories(data: {page: 1, limit: 5}) {
        items {
          id
        }
        total_count
        total_pages
      }
    }`;

    let response = await graphqlCall({
      source: getCategoriesQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data: {
        getCategories: {
          items: take(categoryList, 5),
          "total_count": 12,
          "total_pages": 3
        }
      }
    });
    getCategoriesQuery = `{
      getCategories(data: {page: 2, limit: 5}) {
        items {
          id
        }
        total_count
        total_pages
      }
    }`;

    response = await graphqlCall({
      source: getCategoriesQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data: {
        getCategories: {
          items: slice(categoryList, 5, 10),
          "total_count": 12,
          "total_pages": 3
        }
      }
    });



  });



});
