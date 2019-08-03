import {Auth} from "../Middleware/Auth";
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Cart} from "../entity/Cart";
import {Product} from "../entity/Product";
import {ApiContext} from "../types/ApiContext";
import {User} from "../entity/User";
import {Coupon} from "../entity/Coupon";
import {getConnection} from "typeorm";
import {CartProduct} from "../entity/CartProduct";

@Resolver()
export class CartResolver {
  @UseMiddleware(Auth)
  @Query(() => Cart, { nullable: true})
  public async getCart(@Arg("id") id: number): Promise<Cart | undefined> {
    return await Cart.findOne({where: { id }})
  }

  @UseMiddleware(Auth)
  @Mutation(() => Cart)
  public async addCart (@Ctx() ctx: ApiContext,@Arg("idProduct") idProduct: number,@Arg("idCoupon") idCoupon: number){
    const user = await User.findOne({ where: { id: ctx.req.session!.token} });
    const product = await Product.findOne({ where: { id: idProduct} });
    const coupon = await Coupon.findOne({ where: { id: idCoupon} });
    return await Cart.create({
      product,
      user,
      coupon
    })
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async deleteCart(@Arg("id") id: number) {
    getConnection().createQueryBuilder().delete().from(CartProduct)
      .where("idCart=:id", {id}).execute();
    const cart = getConnection().createQueryBuilder().delete().from(Cart)
      .where("id=:id", {id}).execute();
    return !!cart
  }



}