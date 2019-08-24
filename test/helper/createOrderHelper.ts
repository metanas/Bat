import {User} from "../../src/entity/User";
import {Address} from "../../src/entity/Address";
import {Order} from "../../src/entity/Order";
import faker from "faker";
import {OrderProduct} from "../../src/entity/OrderProduct";
import {createProductHelper} from "./createProductHelper";

export async function createOrderHelper(address: Address, user: User, productCount: number) {
  const order = await Order.create({
    user,
    address: address.address,
    driver: faker.name.firstName() + " " + faker.name.lastName(),
    status: faker.lorem.word()
  }).save();

  order.orderProducts = [];

  for(let i = 0; i < productCount; i++){
    const product = await createProductHelper();
    order.orderProducts.push(await OrderProduct.create({
      order,
      product,
      price: product.priceUnit,
      quantity: faker.random.number(10)
    }).save());
  }
  return order;
}
