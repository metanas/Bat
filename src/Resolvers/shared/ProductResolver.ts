import {Arg, Query, Resolver, UseMiddleware} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Product} from "../../entity/Product";
import PaginatedResponse from "../../Modules/interfaces/PaginatedResponse";
import {ceil} from "lodash";
import {PaginatedResponseInput} from "../../Modules/inputs/PaginatedResponseInput";

const PaginatedProductResponse = PaginatedResponse(Product);
// @ts-ignore
type PaginatedProductResponse = InstanceType<typeof PaginatedProductResponse>


@Resolver()
export class ProductResolver {
  @UseMiddleware(Auth)
  @Query(() => Product, { nullable: true})
  public async getProduct(@Arg("id") id: number): Promise<Product | undefined> {
    return await Product.findOne({ where: { id }, relations: ["productPictures"] })
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedProductResponse)
  public async getProducts(@Arg("data") { page, limit }: PaginatedResponseInput): Promise<PaginatedProductResponse> {
    const result = await Product.findAndCount({ skip: (page - 1) * limit, take: limit });

    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}
