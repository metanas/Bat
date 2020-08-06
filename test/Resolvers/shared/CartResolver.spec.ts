import { Costumer } from "../../../src/entity/Costumer";
import { createCostumerHelper } from "../../helper/createCostumerHelper";
import { connection } from "../../test-utils/connection";
import { Connection } from "typeorm";
import { graphqlCall } from "../../test-utils/graphqlCall";
import { createCartHelper } from "../../helper/createCartHelper";
import { createCartProductHelper } from "../../helper/createCartProductHelper";
import { createProductHelper } from "../../helper/createProductHelper";
import { Product } from "../../../src/entity/Product";
import { CartProduct } from "../../../src/entity/CartProduct";
import { GraphQLError } from "graphql";

describe("Test Cart Resolver", () => {
  let conn: Connection;
  let costumer: Costumer;
  let product: Product;
  let cartProduct: CartProduct;
  beforeAll(async () => {
    conn = await connection();
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Test Getting Cart By CostumerID", async () => {
    costumer = await createCostumerHelper();
    const cart = await createCartHelper(costumer);

    let cartExpect = [];

    for (let i = 0; i < 5; i++) {
      product = await createProductHelper();
      cartProduct = await createCartProductHelper(product, cart);
      cartExpect.push({
        product: { id: product.id.toString() },
        quantity: cartProduct.quantity,
      });
    }

    cartExpect = cartExpect.reverse();

    const getCartQuery = `{
      getCart {
        cartProducts {
          product {
            id
          }
          quantity
        }
        count
      }
    }`;

    const response = await graphqlCall({
      source: getCartQuery,
      user: costumer,
    });

    expect(response).toMatchObject({
      data: {
        getCart: {
          cartProducts: cartExpect,
          count: 5,
        },
      },
    });
  });

  it("Test Delete Cart", async () => {
    costumer = await createCostumerHelper();
    const cart = await createCartHelper(costumer);

    for (let i = 0; i < 5; i++) {
      product = await createProductHelper();
      cartProduct = await createCartProductHelper(product, cart);
    }

    const deleteAllFromCartQuery = `mutation { 
      deleteAllFromCart
    }`;

    let newCart = await CartProduct.find({
      join: {
        alias: "cartProduct",
        leftJoinAndSelect: {
          product: "cartProduct.product",
        },
      },
      where: {
        cartId: cart.id,
      },
    });

    expect(newCart.length).toEqual(5);

    const response = await graphqlCall({
      source: deleteAllFromCartQuery,
      user: costumer,
    });

    expect(response).toMatchObject({
      data: {
        deleteAllFromCart: true,
      },
    });

    newCart = await CartProduct.find({
      join: {
        alias: "cartProduct",
        leftJoinAndSelect: {
          product: "cartProduct.product",
        },
      },
      where: {
        cartId: cart.id,
      },
    });

    expect(newCart.length).toEqual(0);
  });

  it("Test Update Quantity Product", async () => {
    costumer = await createCostumerHelper();
    const cart = await createCartHelper(costumer);
    product = await createProductHelper();
    cartProduct = await createCartProductHelper(product, cart);

    let updateProductQuantityQuery = `mutation {
      updateProductQuantity( productId: ${cartProduct.productId} , quantity: 6) {
          cartProducts {
            quantity
          }
        }
      }`;

    let response = await graphqlCall({
      source: updateProductQuantityQuery,
      user: costumer,
    });

    expect(response).toMatchObject({
      data: {
        updateProductQuantity: {
          cartProducts: [
            {
              quantity: 6,
            },
          ],
        },
      },
    });

    updateProductQuantityQuery = `mutation {
      updateProductQuantity( productId: ${cartProduct.productId} , quantity: ${
      product.quantity + 1
    }) {
          cartProducts {
            quantity
          }
        }
      }`;

    response = await graphqlCall({
      source: updateProductQuantityQuery,
      user: costumer,
    });

    expect(response.errors).toContainEqual(
      new GraphQLError("Quantity Selected is Not Available")
    );
  });

  it("Test Add product To Cart", async () => {
    costumer = await createCostumerHelper();
    const cart = await createCartHelper(costumer);
    product = await createProductHelper();

    const addProductToCartQuery = `mutation {
      addProductToCart(productId: ${product.id} ,quantity: 33 ) {
        id
        cartProducts {
          product {
            id
          }
        }
      }
    }`;

    const response = await graphqlCall({
      source: addProductToCartQuery,
      user: costumer,
    });

    expect(response).toMatchObject({
      data: {
        addProductToCart: {
          id: `${cart.id}`,
          cartProducts: [
            {
              product: {
                id: product.id.toString(),
              },
            },
          ],
        },
      },
    });
  });

  it("Test Add product Quantity more than disponible", async () => {
    costumer = await createCostumerHelper();
    await createCartHelper(costumer);
    product = await createProductHelper();

    const addProductToCartQuery = `mutation {
      addProductToCart(productId: ${product.id} ,quantity: ${
      product.quantity + 1
    } ) {
        id
        cartProducts {
          product {
            id
          }
        }
      }
    }`;

    const response = await graphqlCall({
      source: addProductToCartQuery,
      user: costumer,
    });

    expect(response).toMatchObject({
      errors: [new GraphQLError("Quantity Selected is Not Available")],
    });
  });

  it("Test remove Product From Cart", async () => {
    costumer = await createCostumerHelper();
    const cart = await createCartHelper(costumer);

    for (let i = 0; i < 3; i++) {
      product = await createProductHelper();
      cartProduct = await createCartProductHelper(product, cart);
    }

    const removeProductFromCartQuery = `mutation { 
      removeProductFromCart(productId: ${cartProduct.productId})
    }`;

    const response = await graphqlCall({
      source: removeProductFromCartQuery,
      user: costumer,
    });

    expect(response).toMatchObject({
      data: {
        removeProductFromCart: true,
      },
    });

    const newCart = await CartProduct.find({
      join: {
        alias: "cartProduct",
        leftJoinAndSelect: {
          product: "cartProduct.product",
        },
      },
      where: {
        cartId: cart.id,
      },
    });

    expect(newCart.length).toEqual(2);
  });
});
