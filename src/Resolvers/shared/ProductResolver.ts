import {Arg, Args, Query, Resolver, UseMiddleware} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Product} from "../../entity/Product";
import PaginatedResponse from "../../Modules/interfaces/PaginatedResponse";
import {ceil, set} from "lodash";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";
import {FindManyOptions, Raw} from "typeorm";

const PaginatedProductResponse = PaginatedResponse(Product);
// @ts-ignore
type PaginatedProductResponse = InstanceType<typeof PaginatedProductResponse>


@Resolver()
export class ProductResolver {
  @UseMiddleware(Auth)
  @Query(() => Product, { nullable: true})
  public async getProduct(@Arg("id") id: number): Promise<Product | undefined> {
    return await Product.findOne({ where: { id, enabled: true }, relations: ["productPictures"] })
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedProductResponse)
  public async getProducts(@Args() { page, limit, name }: PaginatedResponseArgs): Promise<PaginatedProductResponse> {
    const options: FindManyOptions = {
      skip: (page - 1) * limit,
      take: limit,
      where: { enabled: true }
    };

    if(name) {
      set(options, "where.name", Raw(columnAlias => `lower(${columnAlias}) like '%${name.toLowerCase()}%'`))
    }

    const result = await Product.findAndCount(options);

    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}
