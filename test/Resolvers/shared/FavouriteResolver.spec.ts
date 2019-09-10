import {createCostumerHelper} from "../../helper/createCostumerHelper";
import {connection} from "../../test-utils/connection";
import {Product} from "../../../src/entity/Product";
import {Costumer} from "../../../src/entity/Costumer";
import {createProductHelper} from "../../helper/createProductHelper";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {Connection} from "typeorm";


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
    addDelFavourite(productId: ${product.id})}`;


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


});