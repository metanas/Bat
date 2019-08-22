import {Cart} from "../../src/entity/Cart";
import {User} from "../../src/entity/User";

export async function createCartHelper(user: User) {
  return await Cart.create({
    user: user
  }).save();

}