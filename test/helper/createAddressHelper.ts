import {Address} from "../../src/entity/Address";
import faker = require("faker");
import {Costumer} from "../../src/entity/Costumer";

export async function createAddressHelper(costumer: Costumer) {
  return await Address.create({
    address: faker.address.streetAddress(),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
    costumer: costumer
  }).save();

}
