import {Connection} from "typeorm";
import {connection} from "../test-utils/connection";
import {User} from "../../src/entity/User";
import {createUserHelper} from "../helper/createUserHelper";
import {Product} from "../../src/entity/Product";
import {createProductHelper} from "../helper/createProductHelper";
import {graphqlCall} from "../test-utils/graphqlCall";
import faker from "faker";
import { toInteger } from "lodash";
import {Category} from "../../src/entity/Category";
import {createCategoryHelper} from "../helper/createCategoryHelper";
import {truncate} from "../helper/truncateTables";


let conn: Connection;
beforeAll(async () => {
  conn = await connection(true);
});

afterAll(async () => {
  await conn.close();
});

beforeEach(async () => {
  await truncate(conn);
});

let user: User;
let product: Product;
let category: Category;

describe("Product Resolver Test", () => {
  it("Test Get Product", async (done) => {
    user = await createUserHelper();

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
    done();
  });

  it("Test Update Product", async (done) => {
    user = await createUserHelper();

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
    done();
  });

  it("Test Add New Product", async (done) => {
    user = await createUserHelper();

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
    done();
  });

  it("Test Delete Product", async (done) => {
    user = await createUserHelper();

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
    done();
  });

  // it.skip("Test Getting Products", async (done) => {
  //   user = await createUserHelper();
  //
  //   const productList: { id: number }[] = [];
  //
  //   for(let i = 0; i < 12; i++){
  //     product = await createProductHelper();
  //     productList.push({ id: product.id });
  //   }
  //
  //   const getProductsQuery = `{
  //     getProducts(data: {page: 1, limit: 5}) {
  //       items {
  //         id
  //       }
  //       total_count
  //       total_pages
  //     }
  //   }`;
  //
  //   const response = await graphqlCall({
  //     source: getProductsQuery,
  //     token: user.id
  //   });
  //
  //   expect(response).toMatchObject({
  //     data: {
  //       getProducts: {
  //         items: productList,
  //         "total_count": 12,
  //         "total_pages": 3
  //       }
  //     }
  //   });
  //   done();
  // });
});
