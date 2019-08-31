import {CartProduct} from "../../src/entity/CartProduct";
import {Cart} from "../../src/entity/Cart";
import {Product} from "../../src/entity/Product";
import faker = require("faker");

export async function createCartProductHelper(product: Product, cart: Cart) {
  return await CartProduct.create({
    cart,
    product,
    quantity: faker.random.number(10)
  }).save();
}
