import {Auth} from "../Middleware/Auth";
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Cart} from "../entity/Cart";
import {ApiContext} from "../types/ApiContext";
import {User} from "../entity/User";
import {getConnection} from "typeorm";

@Resolver()
export class CartResolver {
  @UseMiddleware(Auth)
  @Query(() => Cart, { nullable: true})
  public async getCart(@Ctx() ctx: ApiContext): Promise<Cart | undefined> {
    return await Cart.findOne({ where: { "userId": ctx.req.session!.token }, relations: ["user"] });
  }

  @UseMiddleware(Auth)
  @Mutation(() => Cart)
  public async addCart (@Ctx() ctx: ApiContext){
    const user = await User.findOne({ where: { id: ctx.req.session!.token}, relations: ["user"] });
    return await Cart.create({
      user
    }).save();
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async deleteCart(@Arg("id") id: number) {
    const cart = getConnection().createQueryBuilder().delete().from(Cart)
      .where("id=:id", {id}).execute();
    return !!cart
  }
}
