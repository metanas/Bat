import {Connection} from "typeorm";
import {Costumer} from "../../../src/entity/Costumer";
import {Product} from "../../../src/entity/Product";
import {connection} from "../../test-utils/connection";
import {createCostumerHelper} from "../../helper/createCostumerHelper";
import faker from "faker";
import {createProductHelper} from "../../helper/createProductHelper";
import { toInteger } from "lodash";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {createCategoryHelper} from "../../helper/createCategoryHelper";
import {Category} from "../../../src/entity/Category";

describe("Product Resolver Test", () => {
  let conn: Connection;

  let user: Costumer;
  let product: Product;
  let category: Category;

  beforeAll(async () => {
    conn = await connection();
    user = await createCostumerHelper();
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Update Product", async () => {
    product = await createProductHelper();

    const newProduct = {
      name: faker.commerce.productName(),
      priceUnit: toInteger(faker.commerce.price()),
      quantity: faker.random.number()
    };

    const updateProductQuery = `mutation {
      updateProduct( id: ${product.id}, name: "${newProduct.name}", priceUnit: ${newProduct.priceUnit}, quantity: ${newProduct.quantity}) {
        id
        name
        priceUnit
        quantity
      }
    }`;

    const response = await graphqlCall({
      source: updateProductQuery,
      token: user.id,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        updateProduct: {
          id: `${product.id}`,
          name: newProduct.name,
          priceUnit: newProduct.priceUnit,
          quantity: newProduct.quantity
        }
      }
    });
  });

  it("Test Add New Product", async () => {
    category = await createCategoryHelper();

    const newProduct = {
      name: faker.commerce.productName(),
      priceUnit: toInteger(faker.commerce.price()),
      quantity: faker.random.number()
    };

    const addProductQuery =  `mutation {
      addProduct(name: "${newProduct.name}", priceUnit: ${newProduct.priceUnit}, quantity: ${newProduct.quantity}, categoriesId: ${category.id}) {
        name
        priceUnit
        quantity
      }
    }`;

    const response = await graphqlCall({
      source: addProductQuery,
      token: user.id,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        addProduct: {
          name: newProduct.name,
          priceUnit: newProduct.priceUnit,
          quantity: newProduct.quantity
        }
      }
    });
  });

  it("Test Delete Product", async () => {
    product = await createProductHelper();

    const deleteProductQuery = `mutation {
      deleteProduct(id: ${product.id})
    }`;

    const response = await graphqlCall({
      source: deleteProductQuery,
      token: user.id,
      isAdmin: true
    });

    expect(response.data).toMatchObject({
      deleteProduct: true
    });
  });
});
