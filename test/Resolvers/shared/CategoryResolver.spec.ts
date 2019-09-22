import {connection} from "../../test-utils/connection";
import {Connection} from "typeorm";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {createCategoryHelper} from "../../helper/createCategoryHelper";
import {slice, take} from "lodash";
import {truncate} from "../../helper/truncateTables";


let conn: Connection;

beforeAll(async () => {
  conn = await connection();
});

afterAll(async () => {
  await conn.close();
});


describe("Test Category Resolver",  () => {
  it("Test Getting Category By ID", async () => {
    const category = await createCategoryHelper();

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

  it("Test Get Categories", async () => {
    await truncate(conn, "category");
    const categoryList: { id: string }[] = [];

    for(let i=0; i < 22; i++) {
      const category = await createCategoryHelper();
      categoryList.push({ id: category.id.toString() });
    }

    let getCategoriesQuery = `{
      getCategories(page: 1, limit: 10) {
        items {
          id
        }
      }
    }`;

    let response = await graphqlCall({
      source: getCategoriesQuery
    });

    expect(response).toMatchObject({
      data: {
        getCategories: {
          items: take(categoryList,10)
        }
      }
    });

    getCategoriesQuery = `{
      getCategories(page: 2, limit: 10) {
        items {
          id
        }
        total_pages
        total_count
      }
    }`;

    response = await graphqlCall({
      source: getCategoriesQuery
    });

    expect(response).toMatchObject({
      data: {
        getCategories: {
          items: slice(categoryList, 10, 20),
          "total_pages": 3,
          "total_count": 22
        }
      }
    });
  });

  it("Test get Categories By Name", async () => {
    const category1 = await createCategoryHelper();
    const category2 = await createCategoryHelper();

    let getCategoriesByNameQuery = `{
      getCategories(name: "${category1.name}") {
        items {
          id
        }
        total_count
      }
    }`;

    let response = await graphqlCall({
      source: getCategoriesByNameQuery
    });

    expect(response).toMatchObject({
      data: {
        getCategories: {
          items: [
            {id: category1.id.toString()}
          ],
          "total_count": 1
        }
      }
    });

    getCategoriesByNameQuery = `{
      getCategories(name: "${category2.name}", page: 1) {
        items {
          id
        }
        total_count
      }
    }`;

    response = await graphqlCall({
      source: getCategoriesByNameQuery
    });

    expect(response).toMatchObject({
      data: {
        getCategories: {
          items: [{
            id: category2.id.toString()
          }],
          "total_count": 1
        }
      }
    });
  })
});
