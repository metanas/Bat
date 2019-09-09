import {Arg, Args, Mutation, Resolver, UseMiddleware} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Product} from "../../entity/Product";
import {Category} from "../../entity/Category";
import {ProductArgs} from "../../Modules/inputs/ProductArgs";
import {ProductResolver as Base} from "../shared/ProductResolver";
import {In} from "typeorm";
import {ProductCategory} from "../../entity/ProductCategory";

@Resolver()
export class ProductResolver extends Base {
  @Mutation(() => Product)
  public async addProduct(@Args() args: ProductArgs): Promise<Product> {
    const categories = await Category.find({ where: { id: In(args.categoryIds) } });

    const product = await Product.create({
      name: args.name,
      priceCent: args.priceCent,
      weight: args.weight,
      quantity: args.quantity,
      unit: args.unit
    }).save();

    categories.forEach((category: Category) =>
      ProductCategory.create({
        category,
        product
      }).save().catch((error) => console.log(error))
    );

    return product
  }

  @UseMiddleware(Auth)
  @Mutation(() => Product)
  public async updateProduct(@Arg("id") id: number, @Args() args: ProductArgs){
    // const categories = await Category.find({ where: { id: In(args.categoryIds) }});
    await Product
      .createQueryBuilder()
      .update()
      .set({
        name: args.name,
        priceCent: args.priceCent,
        quantity: args.quantity,
        unit: args.unit,
        weight: args.weight})
      .where("id=:id",{ id })
      .execute();
    return await Product.findOne(id);
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async deleteProduct(@Arg("id") id: number) {
    const result = await Product.createQueryBuilder().delete()
      .where("id=:id", {id}).returning("id").execute();
    return !!result.affected
  }

  @Mutation(() => Product)
  public async toggleProduct(@Arg("id") id: number) {
    const product = await Product.findOne(id);

    if(!product) {
      throw new Error("No Product Found")
    }

    await Product.createQueryBuilder()
      .update()
      .set({ enabled: !product.enabled })
      .where("id=:id", { id })
      .execute();

    await product.reload();

    return product;
  }
}
