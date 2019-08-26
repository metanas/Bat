import {Arg, Query, Resolver} from "type-graphql";
import {Category} from "../../entity/Category";
import PaginatedResponse from "../../Modules/interfaces/PaginatedResponse";
import {PaginatedResponseInput} from "../../Modules/inputs/PaginatedResponseInput"
import {ceil} from "lodash";

const PaginatedCategoryResponse = PaginatedResponse(Category);
// @ts-ignore
type PaginatedCategoryResponse = InstanceType<typeof PaginatedCategoryResponse>;

@Resolver()
export class CategoryResolver {
  @Query(() => Category)
  public async getCategory(@Arg("id", { nullable: true }) id?: number, @Arg("name", { nullable: true }) name?: string) {
    return await Category.findOne({ where: [{ id }, { name }] });
  }

  @Query(() => PaginatedCategoryResponse)
  public async getCategories(@Arg("data") { page, limit }: PaginatedResponseInput): Promise<PaginatedCategoryResponse> {
    const result = await Category.findAndCount({ skip: page - 1, take: limit });
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}
