import {User} from "../../src/entity/User";
import faker from "faker";
import {UserGroup} from "../../src/entity/UserGroup";
import { hash } from "bcryptjs";


export async function createUserHelper(userGroup: UserGroup, password?: string, active = true) {
  password = (password) ? password: faker.lorem.word();
  return await User.create({
    name: faker.name.lastName() + " " + faker.name.lastName(),
    password: await hash(password ,12),
    email: faker.internet.email(),
    active,
    userGroup
  }).save();
}
