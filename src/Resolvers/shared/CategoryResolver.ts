import { Arg, Query, Resolver, Args } from "type-graphql";
import { Category } from "../../entity/Category";
import { ceil, set } from "lodash";
import { PaginatedCategoryResponse } from "../../types/PaginatedResponseTypes";
import { PaginatedResponseArgs } from "../../Modules/inputs/PaginatedResponseArgs";
import { FindManyOptions, Raw } from "typeorm";

@Resolver()
export class CategoryResolver {
  @Query(() => Category)
  public async getCategory(
    @Arg("id", { nullable: true }) id?: number,
    @Arg("name", { nullable: true }) name?: string
  ) {
    return await Category.findOne({ where: [{ id }, { name }] });
  }

  @Query(() => PaginatedCategoryResponse)
  public async getCategories(
    @Args() { name, page, limit }: PaginatedResponseArgs
  ) {
    const options: FindManyOptions = {
      skip: (page - 1) * 10,
      take: limit,
    };

    if (name) {
      set(
        options,
        "where.name",
        Raw(
          (columnAlias) =>
            `lower(${columnAlias}) like '%${name.toLowerCase()}%'`
        )
      );
    }

    const result = await Category.findAndCount(options);
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1],
    };
  }
}
