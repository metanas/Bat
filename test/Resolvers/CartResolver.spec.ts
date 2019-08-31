import {Costumer} from "../../src/entity/Costumer";
import {createCostumerHelper} from "../helper/createCostumerHelper";
import {connection} from "../test-utils/connection";
import {Connection} from "typeorm";
import {graphqlCall} from "../test-utils/graphqlCall";
import {createCartHelper} from "../helper/createCartHelper";
import {createCartProductHelper} from "../helper/createCartProductHelper";
import {createProductHelper} from "../helper/createProductHelper";
import {Product} from "../../src/entity/Product";
import {Cart} from "../../src/entity/Cart";
import {CartProduct} from "../../src/entity/CartProduct";

describe("Test Cart Resolver",  () => {
  let conn: Connection;
  let costumer: Costumer;
  let product: Product;
  let cart: Cart;
  let cartProduct: CartProduct ;
  beforeAll(async () => {
    conn = await connection();

  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Getting Cart By CostumerID", async () => {
    costumer = await createCostumerHelper();
    cart = await createCartHelper(costumer);

    const getCartQuery = `{
      getCart {
        id
      }
    }`;

    const response = await graphqlCall({
      source: getCartQuery,
      token: costumer.id
    });

    expect(response).toMatchObject({
      data:{
        getCart : {
          id: `${cart.id}`
        }
      }
    });
  });
  it.skip("Test Delete Cart", async () => {
    costumer = await createCostumerHelper();
    product = await createProductHelper();
    cartProduct = await createCartProductHelper(product,cart);

    const deleteAllFromCartQuery = `mutation { 
      deleteAllFromCart
    }`;

    const response = await graphqlCall({
      source: deleteAllFromCartQuery,
      token: costumer.id
    });

    expect(response).toMatchObject({
      data: {
        deleteAllFromCart: true
      }
    });
  });
  it("Test Update Quantity Product", async () => {
    costumer = await createCostumerHelper();
    product = await createProductHelper();
    cartProduct = await createCartProductHelper(product,cart);


    const updateProductQuantityQuery = `mutation {
      updateProductQuantity( productId: ${cartProduct.productId} , quantity: ${cartProduct.quantity}) {
          id
        }
      }`;
    const response = await graphqlCall({
      source: updateProductQuantityQuery,
      token: costumer.id,

      });

    expect(response).toMatchObject({
      data: {
        updateProductQuantity: {
          id: `${cart.id}`
        }
      }
    });
  });
  it("Test Add product To Cart", async () => {
    costumer = await createCostumerHelper();
    product = await createProductHelper();


    const addProductToCartQuery = `mutation {
      addProductToCart(productId:${product.id} ,quantity: 33) {
        id
      }
    }`;

    const response = await graphqlCall({
      source: addProductToCartQuery,
      token: costumer.id
    });

    expect(response).toMatchObject({
      data: {
        addProductToCart: {
          id: `${cart.id}`
        }
      }
    });
  });
  it("Test Delete Product From Cart", async () => {
    costumer = await createCostumerHelper();
    product = await createProductHelper();
    cartProduct = await createCartProductHelper(product,cart);

    const removeProductFromCartQuery = `mutation { 
      removeProductFromCart(productId: ${cartProduct.productId})
    }`;

    const response = await graphqlCall({
      source: removeProductFromCartQuery,
      token: costumer.id
    });

    expect(response).toMatchObject({
      data: {
        removeProductFromCart: true
      }
    });
  });
});