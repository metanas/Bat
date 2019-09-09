import {Driver} from "../../src/entity/Driver";
import faker = require("faker");

export async function createDriverHelper() {
  return await Driver.create({
    name : faker.name.findName(),
    telephone : faker.phone.phoneNumber(),
    point : faker.random.number(5),
    avatar : faker.random.word(),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
  }).save();

}