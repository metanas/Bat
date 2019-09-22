import {Arg, Args, Query, Resolver, UseMiddleware} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Product} from "../../entity/Product";
import { ceil } from "lodash";
import {PaginatedProductResponse} from "../../types/PaginatedResponseTypes";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";

@Resolver()
export class ProductResolver {
  @UseMiddleware(Auth)
  @Query(() => Product, { nullable: true})
  public async getProduct(@Arg("id") id: number): Promise<Product | undefined> {
    return await Product.findOne({ where: { id, enabled: true }, relations: ["productPictures"] })
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedProductResponse)
  public async getProducts(@Arg("categoryId", { nullable: true }) categoryId: number, @Args() { name, page, limit }: PaginatedResponseArgs) {
    let query = Product
      .createQueryBuilder("product")
      .select()
      .where("enabled=true");

    if(categoryId) {
      query = query.leftJoin("product.productCategory", "productCategory")
        .andWhere("productCategory.categoryId=:id", { id: categoryId })
    }

    if(name) {
      query = query.andWhere("product.name=:name", { name })
    }

    const result = await query.take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}
