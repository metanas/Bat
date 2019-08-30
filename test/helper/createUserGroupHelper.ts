import {UserGroup} from "../../src/entity/UserGroup";
import faker from "faker";

export async function createUserGroupHelper() {
  return await UserGroup.create({
    name: faker.name.jobTitle(),
    permissions: JSON.parse("{ \"access\": [\"Test\", \"test2\"], \"modify\": [\"Test3\", \"test4\"] }")
  }).save()
}
