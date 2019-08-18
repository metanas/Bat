import {Connection} from "typeorm";
import {connection} from "../test-utils/connection";
import {User} from "../../src/entity/User";
import {createUserHelper} from "../helper/createUserHelper";
import {Product} from "../../src/entity/Product";
import {createProductHelper} from "../helper/createProductHelper";
import {graphqlCall} from "../test-utils/graphqlCall";
import faker from "faker";
import { toInteger, take } from "lodash";
import {Category} from "../../src/entity/Category";
import {createCategoryHelper} from "../helper/createCategoryHelper";
import {truncate} from "../helper/truncateTables";

describe("Product Resolver Test", () => {
  let conn: Connection;

  let user: User;
  let product: Product;
  let category: Category;

  beforeAll(async () => {
    conn = await connection();
    user = await createUserHelper();
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
      token: user.id
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
      token: user.id
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
      token: user.id
    });

    expect(response.data).toMatchObject({
      deleteProduct: true
    });
  });

  it("Test Getting Products", async () => {
    await truncate(conn, "product");

    const productList: { id: string }[] = [];

    for(let i = 0; i < 12; i++){
      product = await createProductHelper();
      productList.push({ id: `${product.id}` });
    }

    const getProductsQuery = `{
      getProducts(data: {page: 1, limit: 5}) {
        items {
          id
        }
        total_count
        total_pages
      }
    }`;

    const response = await graphqlCall({
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
  });
});
