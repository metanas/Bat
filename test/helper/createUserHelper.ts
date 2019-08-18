import {User} from "../../src/entity/User";
import faker from "faker";

export async function createUserHelper(): Promise<User> {
  return await User.create({
    name: faker.name.firstName() + " " + faker.name.lastName(),
    telephone: faker.phone.phoneNumber(),
    birthday: faker.date.past().toDateString()
  }).save();
}
