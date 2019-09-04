import {Connection} from "typeorm";
import {Product} from "../../../src/entity/Product";
import {connection} from "../../test-utils/connection";
import faker from "faker";
import {createProductHelper} from "../../helper/createProductHelper";
import {toInteger} from "lodash";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {createCategoryHelper} from "../../helper/createCategoryHelper";
import {Category} from "../../../src/entity/Category";
import {createUserHelper} from "../../helper/createUserHelper";
import {createUserGroupHelper} from "../../helper/createUserGroupHelper";
import {User} from "../../../src/entity/User";

describe("Product Resolver Test", () => {
  let conn: Connection;

  let user: User;
  let product: Product;
  let category: Category;

  beforeAll(async () => {
    conn = await connection();
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Update Product", async () => {
    const userGroup = await createUserGroupHelper();
    user = await createUserHelper(userGroup);

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
      user: user,
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
    const userGroup = await createUserGroupHelper();
    user = await createUserHelper(userGroup);

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
      user: user,
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
    const userGroup = await createUserGroupHelper();
    user = await createUserHelper(userGroup);

    product = await createProductHelper();

    const deleteProductQuery = `mutation {
      deleteProduct(id: ${product.id})
    }`;

    const response = await graphqlCall({
      source: deleteProductQuery,
      user,
      isAdmin: true
    });

    expect(response.data).toMatchObject({
      deleteProduct: true
    });
  });
});
