import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware,} from "type-graphql";
import {Auth} from "../Middleware/Auth";
import {Product} from "../entity/Product";
import {ApiContext} from "../types/ApiContext";
import {Favourite} from "../entity/Favourite";
import {getConnection} from "typeorm";

@Resolver()
export class ProductResolver {
  @UseMiddleware(Auth)
  @Query(() => Product, { nullable: true})
  public async getProduct(@Arg("id") id: number): Promise<Product | undefined> {
    return await Product.findOne({where: {id}})
  }

  @UseMiddleware(Auth)
  @Mutation(() => Product)
  public async UpdateProduct(@Arg("id") id: number,@Arg("name") name: string,@Arg("priceUnit") priceUnit: number,@Arg("quantity") quantity: number){
    return await getConnection()
      .createQueryBuilder()
      .update(Product)
      .set({name,priceUnit,quantity})
      .where("id=:id",{id})
      .execute();
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async deleteProduct(@Arg("id") id: number) {
    const product = getConnection().createQueryBuilder().delete().from(Product)
      .where("id=:id", {id}).execute();
    return !!product
  }

  @UseMiddleware(Auth)
  @Query(() => [Product])
  public async getProducts(@Ctx() ctx: ApiContext, @Arg("page") page: number, @Arg("limit") limit: number): Promise<Product[]> {
    const favourite = await Favourite.findOne({ where: { id: ctx.req.session!.token }});
    const result = await Product.findAndCount({where: {favourite}, skip: page, take: limit});
    return result[0];
  }
}
