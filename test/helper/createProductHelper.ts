import {Product} from "../../src/entity/Product";
import faker = require("faker");
import { toInteger } from "lodash";


export async function createProductHelper() {
  return await Product.create({
    name: faker.commerce.productName(),
    quantity: faker.random.number(),
    priceUnit: toInteger(faker.commerce.price())
  }).save();
}
