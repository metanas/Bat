import {User} from "../../src/entity/User";
import faker from "faker";
import bcrypt from "bcrypt";
import {UserGroup} from "../../src/entity/UserGroup";


export async function createUserHelper(userGroup: UserGroup) {
  return await User.create({
    name: faker.name.lastName() + " " + faker.name.lastName(),
    password: await bcrypt.hash(faker.lorem.word() ,12),
    userGroup
  }).save();
}
