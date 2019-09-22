import {Product} from "../../src/entity/Product";
import {Category} from "../../src/entity/Category";
import {ProductCategory} from "../../src/entity/ProductCategory";

export async function associateProductAndCategory(product: Product, category: Category) {
  return await ProductCategory.create({
    product,
    category
  }).save()

}
