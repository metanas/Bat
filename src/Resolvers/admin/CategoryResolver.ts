import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Category } from "../../entity/Category";
import { CategoryResolver as Base } from "../shared/CategoryResolver";
import { Admin } from "../../Middleware/Admin";

@Resolver()
export class CategoryResolver extends Base {
  @Mutation(() => Category)
  public async updateCategory(
    @Arg("id") id: number,
    @Arg("name") name: string
  ): Promise<Category | undefined> {
    await Category.createQueryBuilder()
      .update()
      .set({ name })
      .where("id=:id", { id })
      .execute();

    return await Category.findOne({ where: { id } });
  }

  @UseMiddleware(Admin)
  @Mutation(() => Boolean)
  public async deleteCategory(@Arg("id") id: number): Promise<boolean> {
    const result = await Category.createQueryBuilder()
      .delete()
      .where("id=:id", { id })
      .returning("id")
      .execute();
    return !!result.affected;
  }

  @UseMiddleware(Admin)
  @Mutation(() => Category)
  public async addCategory(@Arg("name") name: string): Promise<Category> {
    return await Category.create({
      name,
    }).save();
  }
}
