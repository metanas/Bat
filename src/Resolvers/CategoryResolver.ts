import {Query, Resolver, Arg, Mutation } from "type-graphql";
import {Category} from "../entity/Category";
import {getConnection} from "typeorm";
import PaginatedResponse from "../Modules/interfaces/PaginatedResponse";
import { PaginatedResponseInput } from "../Modules/inputs/PaginatedResponseInput"
import { ceil } from "lodash";

const PaginatedCategoryResponse = PaginatedResponse(Category);
// @ts-ignore
type PaginatedCategoryResponse = InstanceType<typeof PaginatedCategoryResponse>;

@Resolver()
export class CategoryResolver {
  @Query(() => Category)
  public async getCategory(@Arg("id", { nullable: true }) id?: number, @Arg("name", { nullable: true }) name?: string) {
    return await Category.findOne({ where: [{ id }, { name }] });
  }

  @Mutation(() => Category)
  public async addCategory(@Arg("name") name: string) {
    return await Category.create({
      name
    }).save()
  }

  @Mutation(() => String)
  public async updateCategory(@Arg("id") id: number, @Arg("name") name: string) {
    await getConnection()
      .createQueryBuilder()
      .update(Category)
      .set({name})
      .where("id=:id", {id})
      .execute();
    return
  }

  @Mutation(() => Boolean)
  public async deleteCategory(@Arg("id") id: number) {
    return !await Category.delete(id)
  }

  @Query(() => PaginatedCategoryResponse)
  public async getCategories(@Arg("data") { page, limit }: PaginatedResponseInput){
    const result = await Category.findAndCount({ skip: page - 1, take: limit });
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    }
  }
}
