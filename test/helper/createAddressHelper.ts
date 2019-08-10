import {Address} from "../../src/entity/Address";
import faker = require("faker");
import {User} from "../../src/entity/User";

export async function createAddressHelper(user: User) {
  return await Address.create({
    address: faker.address.streetAddress(),
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
    user: user
  }).save();

}
