import {Category} from "../../src/entity/Category";
import faker from "faker";

export async function createCategoryHelper(enabled = true): Promise<Category> {
  return await Category.create({
    name: faker.commerce.productName(),
    state: enabled
  }).save();
}
