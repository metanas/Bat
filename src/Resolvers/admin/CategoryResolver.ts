import {Arg, Mutation, Resolver} from "type-graphql";
import {Category} from "../../entity/Category";
import {getConnection} from "typeorm";
import {CategoryResolver as Base } from "../shared/CategoryResolver";

@Resolver()
export class CategoryResolver extends Base{
  @Mutation(() => Category)
  public async updateCategory(@Arg("id") id: number, @Arg("name") name: string) {
    await getConnection()
      .createQueryBuilder()
      .update(Category)
      .set({name})
      .where("id=:id", {id})
      .execute();

    return await Category.findOne({where: {id}})
  }

  @Mutation(() => Boolean)
  public async deleteCategory(@Arg("id") id: number) {
    const result = await getConnection().createQueryBuilder().delete().from(Category)
      .where("id=:id", {id}).returning("id").execute();
    return !!result.affected
  }

  @Mutation(() => Category)
  public async addCategory(@Arg("name") name: string) {
    return await Category.create({
      name
    }).save()
  }
}
