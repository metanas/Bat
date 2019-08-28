import {Connection} from "typeorm";
import {connection} from "../test-utils/connection";
import {Costumer} from "../../src/entity/Costumer";
import {createCostumerHelper} from "../helper/createCostumerHelper";
import {Product} from "../../src/entity/Product";
import {createProductHelper} from "../helper/createProductHelper";
import {graphqlCall} from "../test-utils/graphqlCall";
import {slice, take} from "lodash";
import {truncate} from "../helper/truncateTables";

describe("Product Resolver Test", () => {
  let conn: Connection;

  let costumer: Costumer;
  let product: Product;
  // let category: Category;

  beforeAll(async () => {
    conn = await connection();
    costumer = await createCostumerHelper();
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
      token: costumer.id
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

  // it("Test Update Product", async () => {
  //   product = await createProductHelper();
  //
  //   const newProduct = {
  //     name: faker.commerce.productName(),
  //     priceUnit: toInteger(faker.commerce.price()),
  //     quantity: faker.random.number()
  //   };
  //
  //   const updateProductQuery = `mutation {
  //     updateProduct( id: ${product.id}, name: "${newProduct.name}", priceUnit: ${newProduct.priceUnit}, quantity: ${newProduct.quantity}) {
  //       id
  //       name
  //       priceUnit
  //       quantity
  //     }
  //   }`;
  //
  //   const response = await graphqlCall({
  //     source: updateProductQuery,
  //     token: costumer.id
  //   });
  //
  //   expect(response).toMatchObject({
  //     data: {
  //       updateProduct: {
  //         id: `${product.id}`,
  //         name: newProduct.name,
  //         priceUnit: newProduct.priceUnit,
  //         quantity: newProduct.quantity
  //       }
  //     }
  //   });
  // });

  // it("Test Add New Product", async () => {
  //   category = await createCategoryHelper();
  //
  //   const newProduct = {
  //     name: faker.commerce.productName(),
  //     priceUnit: toInteger(faker.commerce.price()),
  //     quantity: faker.random.number()
  //   };
  //
  //   const addProductQuery =  `mutation {
  //     addProduct(name: "${newProduct.name}", priceUnit: ${newProduct.priceUnit}, quantity: ${newProduct.quantity}, categoriesId: ${category.id}) {
  //       name
  //       priceUnit
  //       quantity
  //     }
  //   }`;
  //
  //   const response = await graphqlCall({
  //     source: addProductQuery,
  //     token: costumer.id
  //   });
  //
  //   expect(response).toMatchObject({
  //     data: {
  //       addProduct: {
  //         name: newProduct.name,
  //         priceUnit: newProduct.priceUnit,
  //         quantity: newProduct.quantity
  //       }
  //     }
  //   });
  // });

  // it("Test Delete Product", async () => {
  //   product = await createProductHelper();
  //
  //   const deleteProductQuery = `mutation {
  //     deleteProduct(id: ${product.id})
  //   }`;
  //
  //   const response = await graphqlCall({
  //     source: deleteProductQuery,
  //     token: costumer.id
  //   });
  //
  //   expect(response.data).toMatchObject({
  //     deleteProduct: true
  //   });
  // });

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
      token: costumer.id
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
      token: costumer.id
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
