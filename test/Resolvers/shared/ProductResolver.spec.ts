import {Connection} from "typeorm";
import {connection} from "../../test-utils/connection";
import {Costumer} from "../../../src/entity/Costumer";
import {createCostumerHelper} from "../../helper/createCostumerHelper";
import {Product} from "../../../src/entity/Product";
import {createProductHelper} from "../../helper/createProductHelper";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {slice, take} from "lodash";
import {truncate} from "../../helper/truncateTables";
import {createCategoryHelper} from "../../helper/createCategoryHelper";
import {associateProductAndCategory} from "../../helper/associateProductAndCategoryHelper";

describe("Product Resolver Test", () => {
  let conn: Connection;

  let user: Costumer;
  let product: Product;

  beforeAll(async () => {
    conn = await connection();
    user = await createCostumerHelper();
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Get Product", async () => {
    product = await createProductHelper(true);

    const getProductQuery = `{
      getProduct(id: ${product.id}) {
        id
        name
        priceCent
        quantity
      }
    }`;

    const response = await graphqlCall({
      source: getProductQuery,
      user
    });

    expect(response).toMatchObject({
      data: {
        getProduct: {
          id: `${product.id}`,
          name: product.name,
          priceCent: product.priceCent,
          quantity: product.quantity
        }
      }
    });

  });

  it("Test Getting Products", async () => {
    await truncate(conn, "product");

    const productList: { id: string }[] = [];

    for(let i = 0; i < 12; i++){
      product = await createProductHelper(true);
      productList.push({ id: `${product.id}` });
    }

    let getProductsQuery = `{
      getProducts(page: 1, limit: 5) {
        items {
          id
        }
        total_count
        total_pages
      }
    }`;

    let response = await graphqlCall({
      source: getProductsQuery,
      user
    });

    expect(response).toMatchObject({
      data: {
        getProducts: {
          items: take(productList, 5),
          "total_count": 12,
          "total_pages": 3
        }
      }
    });

    getProductsQuery = `{
      getProducts(page: 2, limit: 5) {
        items {
          id
        }
        total_count
        total_pages
      }
    }`;

    response = await graphqlCall({
      source: getProductsQuery,
      user
    });

    expect(response).toMatchObject({
      data: {
        getProducts: {
          items: slice(productList, 5, 10),
          "total_count": 12,
          "total_pages": 3
        }
      }
    });
  });

  //TODO GET PRODUCTS BY FILTER NAME AND CATEGORY

  it("Search Product By Name and Category Id", async () => {
    const category = await createCategoryHelper();
    const product = await createProductHelper(true);

    await associateProductAndCategory(product, category);

    let getProductsQuery = `{
      getProducts(name: "${product.name}",page: 1, limit: 5) {
        items {
          id
        }
        total_count
        total_pages
      }
    }`;

    let response = await graphqlCall({
      source: getProductsQuery,
      user
    });

    expect(response).toMatchObject({
      data: {
        getProducts: {
          items: [ {id: product.id.toString()} ],
          "total_count": 1,
          "total_pages": 1
        }
      }
    });

    getProductsQuery = `{
      getProducts(categoryId: ${category.id}, page: 1, limit: 5) {
        items {
          id
        }
        total_count
        total_pages
      }
    }`;

    response = await graphqlCall({
      source: getProductsQuery,
      user
    });

    expect(response).toMatchObject({
      data: {
        getProducts: {
          items: [
            {
              id: product.id.toString()
            }
          ],
          "total_count": 1,
          "total_pages": 1
        }
      }
    })
  });
});
