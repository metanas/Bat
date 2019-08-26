import {Arg, Mutation, Resolver, UseMiddleware} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Product} from "../../entity/Product";
import {Category} from "../../entity/Category";
import {getConnection} from "typeorm";

@Resolver()
export class ProductResolver {
  @UseMiddleware(Auth)
  @Mutation(() => Product)
  public async addProduct(@Arg("name") name: string, @Arg("priceUnit") priceUnit: number, @Arg("quantity") quantity: number, @Arg("categoriesId") categoryId: number): Promise<Product> {
    const categories = await Category.find({ where : {id: categoryId }});
    return await Product.create({
      name,
      priceUnit,
      quantity,
      categories
    }).save();
  }

  @UseMiddleware(Auth)
  @Mutation(() => Product)
  public async updateProduct(@Arg("id") id: number,@Arg("name") name: string,@Arg("priceUnit") priceUnit: number,@Arg("quantity") quantity: number){
    await getConnection()
      .createQueryBuilder()
      .update(Product)
      .set({ name, priceUnit, quantity })
      .where("id=:id",{ id })
      .execute();
    return await Product.findOne({ where: {id} });
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async deleteProduct(@Arg("id") id: number) {
    const result = await getConnection().createQueryBuilder().delete().from(Product)
      .where("id=:id", {id}).returning("id").execute();
    return !!result.affected
  }

}