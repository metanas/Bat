import {Costumer} from "../../src/entity/Costumer";
import faker from "faker";

export async function createCostumerHelper(): Promise<Costumer> {
  return await Costumer.create({
    name: faker.name.firstName() + " " + faker.name.lastName(),
    telephone: faker.phone.phoneNumber(),
    birthday: faker.date.past().toDateString()
  }).save();
}
