import {Costumer} from "../../src/entity/Costumer";
import {Address} from "../../src/entity/Address";
import {Order} from "../../src/entity/Order";
import faker from "faker";
import {OrderProduct} from "../../src/entity/OrderProduct";
import {createProductHelper} from "./createProductHelper";

export async function createOrderHelper(address: Address, costumer: Costumer, productCount: number) {
  const order = await Order.create({
    costumer,
    address: address.address,
    driverName: faker.name.firstName() + " " + faker.name.lastName(),
    status: faker.lorem.word()
  }).save();

  order.orderProducts = [];

  for(let i = 0; i < productCount; i++){
    const product = await createProductHelper();
    order.orderProducts.push(await OrderProduct.create({
      order,
      product,
      price: product.priceCent,
      quantity: faker.random.number(10)
    }).save());
  }
  return order;
}
