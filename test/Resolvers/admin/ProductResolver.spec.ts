import {Connection} from "typeorm";
import {Product} from "../../../src/entity/Product";
import {connection} from "../../test-utils/connection";
import faker from "faker";
import {createProductHelper} from "../../helper/createProductHelper";
import {toInteger, take} from "lodash";
import {graphqlCall} from "../../test-utils/graphqlCall";
import {createCategoryHelper} from "../../helper/createCategoryHelper";
import {Category} from "../../../src/entity/Category";
import {createUserHelper} from "../../helper/createUserHelper";
import {createUserGroupHelper} from "../../helper/createUserGroupHelper";
import {User} from "../../../src/entity/User";
import {truncate} from "../../helper/truncateTables";
import {associateProductAndCategory} from "../../helper/associateProductAndCategoryHelper";

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
      priceCent: toInteger(faker.commerce.price()),
      quantity: faker.random.number()
    };

    const updateProductQuery = `mutation {
      updateProduct( id: ${product.id}, name: "${newProduct.name}", priceCent: ${newProduct.priceCent}, unit: "KG", weight: 1, quantity: ${newProduct.quantity}, categoryIds: [1]) {
        id
        name
        priceCent
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
          priceCent: newProduct.priceCent,
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
      priceCent: toInteger(faker.commerce.price()),
      quantity: faker.random.number()
    };

    const addProductQuery =  `mutation {
      addProduct(name: "${newProduct.name}", priceCent: ${newProduct.priceCent}, unit: "kg", weight: 1 ,quantity: ${newProduct.quantity}, categoryIds: [${category.id}]) {
        name
        priceCent
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
          priceCent: newProduct.priceCent,
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

  it("Test Toggle State Product", async () => {
    const product = await createProductHelper();

    const toggleProductQuery = `mutation {
      toggleProduct(id: ${product.id}) {
        enabled
      }
    }`;

    const response = await graphqlCall({
      source: toggleProductQuery,
      user,
      isAdmin: true
    });

    expect(response).toMatchObject({
      data: {
        toggleProduct: {
          enabled: true
        }
      }
    });
  });

  it("Test Get Products", async () => {
    await truncate(conn, "product");
    const category1 = await createCategoryHelper();
    const category2 = await createCategoryHelper();

    const productList: { id: string; name: string }[] = [];
    for(let i=0; i < 14; i++) {
      const product = await createProductHelper(i % 2 == 0);
      if(i % 2 == 0) {
        await associateProductAndCategory(product, category1)
      } else {
        await associateProductAndCategory(product, category2);
      }
      productList.push({ id: product.id.toString(), name: product.name });
    }

    let getProductQuery = `{ 
      getProducts(limit: 5) {
        items {
          id
          name
        }
        total_pages
        total_count
      } 
    }`;

    let response = await graphqlCall({
      source: getProductQuery,
      isAdmin: true,
      user
    });

    expect(response).toMatchObject({
      data: {
        getProducts: {
          items: take(productList, 5),
          "total_count": 14,
          "total_pages": 3
        }
      }
    });

    const productExpected = productList.shift();


    getProductQuery = `{ 
      getProducts(name: "${productExpected!.name}" ) {
        items {
          id
          name
        }
      } 
    }`;


    response = await graphqlCall({
      source: getProductQuery,
      isAdmin: true,
      user
    });

    expect(response).toMatchObject({
      data: {
        getProducts: {
          items: [
            {
              id: productExpected!.id.toString(),
              name: productExpected!.name
            }
          ]
        }
      }
    });

    getProductQuery = `{ 
      getProducts(categoryId: ${category1.id}, limit: 1) {
        items {
          id
          name
        }
        total_count
      } 
    }`;


    response = await graphqlCall({
      source: getProductQuery,
      isAdmin: true,
      user
    });

    expect(response).toMatchObject({
      data: {
        getProducts: {
          items: [
            {
              id: productExpected!.id.toString(),
              name: productExpected!.name
            }
          ],
          "total_count": 7
        }
      }
    });

  });
});
