import {Cart} from "../../src/entity/Cart";
import {Costumer} from "../../src/entity/Costumer";

export async function createCartHelper(costumer: Costumer) {
  return await Cart.create({
    costumer
  }).save();
}
