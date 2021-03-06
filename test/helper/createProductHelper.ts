import {Product} from "../../src/entity/Product";
import faker = require("faker");
import { toInteger } from "lodash";


export async function createProductHelper(enabled = false) {
  return await Product.create({
    name: faker.commerce.productName(),
    quantity: faker.random.number(),
    priceCent: toInteger(faker.commerce.price()),
    enabled,
    weight: faker.random.number({ min: 0, max: 100 }),
    unit: faker.name.prefix()
  }).save();
}
