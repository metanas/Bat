import {Auth} from "../Middleware/Auth";
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Cart} from "../entity/Cart";
import {ApiContext} from "../types/ApiContext";
import {Coupon} from "../entity/Coupon";
import {getConnection} from "typeorm";
import {CartProduct} from "../entity/CartProduct";
import {User} from "../entity/User";

@Resolver()
export class CartResolver {
  @UseMiddleware(Auth)
  @Query(() => Cart, { nullable: true})
  public async getCart(@Ctx() ctx: ApiContext): Promise<Cart | undefined> {
    const cart = await Cart.findOne({where: { userId: ctx.req.session!.token }});
    if(cart) {
      cart.cartProducts = await CartProduct.find({
        join: {
          alias: "cartProduct",
          leftJoinAndSelect: {
            product: "cartProduct.product"
          }
        },
        where: {
          cartId: cart.id
        }
      });
    }
    return cart
  }

  // TODO Implementation
  @UseMiddleware(Auth)
  @Mutation(() => Cart)
  public async setCouponToCart (@Ctx() ctx: ApiContext, @Arg("idCoupon", { nullable: true }) idCoupon?: number){
    const user = await User.findOne({ where: { id: ctx.req.session!.token} });
    const coupon = (idCoupon) ? await Coupon.findOne({ where: { id: idCoupon} }) : undefined;
    if(!coupon) {
      throw new Error("Invalid Coupon !!")
    }
    await Cart.update({user}, {coupon});
  }

  @UseMiddleware(Auth)
  @Mutation(() => Cart)
  public async addProductToCart(@Ctx() ctx: ApiContext, @Arg("productId") productId: number, @Arg("quantity") quantity: number) {
    const cart = await Cart.findOne({ where: { userId: ctx.req.session!.token } });
    // const product = await Product.findOne(productId);
    if(cart) {
      await CartProduct.create({
        cart,
        quantity,
        productId
      }).save()
    }
    return await this.getCart(ctx)
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async deleteAllFromCart(@Ctx() ctx: ApiContext) {
    const cart = await Cart.findOne({ where: { userId: ctx.req.session!.token }});
    const result = await getConnection().createQueryBuilder().delete().from(CartProduct)
      .where("cartId=:id", {cartId: cart!.id})
      .returning("id")
      .execute();
    return !!result.affected
  }

  @Mutation(() => Cart)
  @UseMiddleware(Auth)
  public async updateProductQuantity(@Ctx() ctx: ApiContext, @Arg("productId") productId: number, @Arg("quantity") quantity: number) {
    const cart = await Cart.findOne({ where: { userId: ctx.req.session!.token }});
    if(cart) {
      await getConnection()
        .createQueryBuilder()
        .update(CartProduct)
        .set({
          quantity
        })
        .where("cartId= :cartId", {cartId: cart.id})
        .andWhere("productId=:productId", { productId })
        .execute();
      cart.cartProducts = await CartProduct.find({ where: { cartId: cart.id }})
    }
    return cart
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  public async removeProductFromCart(@Ctx() ctx: ApiContext, @Arg("productId") productId: number) {
    const cart = await Cart.findOne({ where: {userId: ctx.req.session!.token }});
    if(cart) {
      const result = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(CartProduct)
        .where("productId=:productId", {productId})
        .execute();
      return !!result.affected;
    }
    return false
  }
}
