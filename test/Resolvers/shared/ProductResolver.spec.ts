  import {Connection} from "typeorm";
import {connection} from "../../test-utils/connection";
import {Costumer} from "../../../src/entity/Costumer";
import {createCostumerHelper} from "../../helper/createCostumerHelper";
import {Product} from "../../../src/entity/Product";
import {createProductHelper} from "../../helper/createProductHelper";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {slice, take} from "lodash";
import {truncate} from "../../helper/truncateTables";

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
    product = await createProductHelper();

    const getProductQuery = `{
      getProduct(id: ${product.id}) {
        id
        name
        priceUnit
        quantity
      }
    }`;

    const response = await graphqlCall({
      source: getProductQuery,
      token: user.id
    });

    expect(response).toMatchObject({
      data: {
        getProduct: {
          id: `${product.id}`,
          name: product.name,
          priceUnit: product.priceUnit,
          quantity: product.quantity
        }
      }
    });

  });

  it("Test Getting Products", async () => {
    await truncate(conn, "product");

    const productList: { id: string }[] = [];

    for(let i = 0; i < 12; i++){
      product = await createProductHelper();
      productList.push({ id: `${product.id}` });
    }

    let getProductsQuery = `{
      getProducts(data: {page: 1, limit: 5}) {
        items {
          id
        }
        total_count
        total_pages
      }
    }`;

    let response = await graphqlCall({
      source: getProductsQuery,
      token: user.id
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
      getProducts(data: {page: 2, limit: 5}) {
        items {
          id
        }
        total_count
        total_pages
      }
    }`;

    response = await graphqlCall({
      source: getProductsQuery,
      token: user.id
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
});
