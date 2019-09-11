import {createCostumerHelper} from "../../helper/createCostumerHelper";
import {connection} from "../../test-utils/connection";
import {Product} from "../../../src/entity/Product";
import {Costumer} from "../../../src/entity/Costumer";
import {createProductHelper} from "../../helper/createProductHelper";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {Connection} from "typeorm";
import {truncate} from "../../helper/truncateTables";
import {take} from "lodash";
import {createFavouriteHelper} from "../../helper/createFavouriteHelper";



describe("Test Cart Resolver",  () => {

  let conn: Connection;
  let costumer: Costumer;
  let product: Product;

  beforeAll(async () => {
    conn = await connection();

  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Add and Delete Favourite", async () => {

    costumer = await createCostumerHelper();
    product = await createProductHelper();


    const addDelFavouriteQuery = `mutation {
      addDelFavourite(productId: ${product.id})
    }`;

    const response = await graphqlCall({
      source: addDelFavouriteQuery,
      user: costumer
    });

    console.log(response.errors);

    expect(response).toMatchObject({
      data:{
        addDelFavourite: true
      }
    });
  });
  it("Test Get Coupons", async () => {
    await truncate(conn, "favourite");


    const favouriteList: {costumerId: string,productId:number}[] = [];
    costumer = await createCostumerHelper();
    for(let i=0; i< 22; i++) {

      product = await createProductHelper();
      const favourite = await createFavouriteHelper(costumer,product);
      favouriteList.push({ costumerId: favourite.costumerId.toString(),productId:favourite.productId });
    }

    const getProductsFavouriteQuery = `{
      getProductsFavourite(page: 1, limit: 10) {
        items {
          costumerId
          productId
        }
        total_pages
        total_count
      }
    }`;

    const response = await graphqlCall({
      source: getProductsFavouriteQuery,
    });

    expect(response).toMatchObject({
      data: {
        getProductsFavourite: {
          items: take(favouriteList, 10),
          "total_pages": 3,
          "total_count": 22
        }
      }
    })
  });


});
