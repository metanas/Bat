import {Arg, Args, Query, Resolver, UseMiddleware} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Product} from "../../entity/Product";
import {ceil, set} from "lodash";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";
import {FindManyOptions, Raw, In,} from "typeorm";
import {ProductCategory} from "../../entity/ProductCategory";
import {PaginatedProductResponse} from "../../types/PaginatedResponseTypes";

@Resolver()
export class ProductResolver {
  @UseMiddleware(Auth)
  @Query(() => Product, { nullable: true})
  public async getProduct(@Arg("id") id: number): Promise<Product | undefined> {
    return await Product.findOne({ where: { id, enabled: true }, relations: ["productPictures"] })
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedProductResponse)
  public async getProducts(@Arg("categoryId", { nullable: true }) categoryId: number, @Args() { page, limit, name }: PaginatedResponseArgs) {
    const options: FindManyOptions = {
      skip: (page - 1) * limit,
      take: limit,
      where: { enabled: true }
    };

    if(categoryId) {
      const productIds: number[] = [];
      const productCategory = await ProductCategory.find({ where: {categoryId}, select: ["productId"]});
      await productCategory.forEach(product => productIds.push(product.productId));
      set(options, "where.id", In(productIds));
    }

    if(name) {
      set(options, "where.name", Raw(columnAlias => `lower(${columnAlias}) like '%${name.toLowerCase()}%'`));
    }

    const result = await Product.findAndCount(options);

    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}
