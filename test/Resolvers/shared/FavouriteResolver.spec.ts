import { createCostumerHelper } from "../../helper/createCostumerHelper";
import { connection } from "../../test-utils/connection";
import { Product } from "../../../src/entity/Product";
import { Costumer } from "../../../src/entity/Costumer";
import { createProductHelper } from "../../helper/createProductHelper";
import { graphqlCall } from "../../test-utils/graphqlCall";
import { Connection } from "typeorm";
import { truncate } from "../../helper/truncateTables";
import { take } from "lodash";
import { createFavouriteHelper } from "../../helper/createFavouriteHelper";

describe("Test Favourite Resolver", () => {
  let conn: Connection;
  let costumer: Costumer;
  let product: Product;

  beforeAll(async () => {
    conn = await connection();
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Add Favourite", async () => {
    costumer = await createCostumerHelper();
    product = await createProductHelper();

    const addDelFavouriteQuery = `mutation {
      addDelFavourite(productId: ${product.id})
    }`;

    const response = await graphqlCall({
      source: addDelFavouriteQuery,
      user: costumer,
    });
    expect(response).toMatchObject({
      data: {
        addDelFavourite: true,
      },
    });
  });
  it("Test Del Favourite", async () => {
    costumer = await createCostumerHelper();
    product = await createProductHelper();
    await createFavouriteHelper(costumer, product);

    const addDelFavouriteQuery = `mutation {
      addDelFavourite(productId: ${product.id})
    }`;

    const response = await graphqlCall({
      source: addDelFavouriteQuery,
      user: costumer,
    });

    expect(response).toMatchObject({
      data: {
        addDelFavourite: true,
      },
    });
  });
  it("Test Get Favourite Products", async () => {
    await truncate(conn, "favourite");

    const favouriteList: { id: string; name: string }[] = [];
    costumer = await createCostumerHelper();

    for (let i = 0; i < 22; i++) {
      product = await createProductHelper();
      const favourite = await createFavouriteHelper(costumer, product);

      favouriteList.push({
        id: favourite.productId.toString(),
        name: product.name,
      });
    }

    const getProductsFavouriteQuery = `{
      getProductsFavourite(page: 1, limit: 10) {
        items {
          id
          name
        }
        total_pages
        total_count
      }
    }`;

    const response = await graphqlCall({
      source: getProductsFavouriteQuery,
      user: costumer,
    });
    expect(response).toMatchObject({
      data: {
        getProductsFavourite: {
          items: take(favouriteList, 10),
          total_pages: 3,
          total_count: 22,
        },
      },
    });
  });
});
