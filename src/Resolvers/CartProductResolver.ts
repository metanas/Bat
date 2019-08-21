import {Resolver, Query, Arg, Mutation, Ctx, UseMiddleware} from "type-graphql";
import {CartProduct} from "../entity/CartProduct";
import {Cart} from "../entity/Cart";
import {ApiContext} from "../types/ApiContext";
import {Auth} from "../Middleware/Auth";
import {Product} from "../entity/Product";
import {getConnection} from "typeorm";

@Resolver()
export class CartProductResolver {
  @Query(() => [CartProduct])
  public async getProductsFromCart(@Arg("cartId") cartId: number) {
    console.log(cartId);
    const result = await CartProduct.find({where: { cartId }, relations: ["product"] });
    console.log(result);
    return result;
  }

  @Mutation(() => CartProduct)
  @UseMiddleware(Auth)
  public async addProductToCart(@Ctx() ctx: ApiContext, @Arg("productId") productId: number, @Arg("quantity") quantity: number){
    const cart = await Cart.findOne({ where: {userId: ctx.req.session!.token }});
    const product = await Product.findOne(productId);
    return await CartProduct.create({
      cart,
      product,
      quantity
    }).save()
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
        .returning("id")
        .execute();
      return !!result.affected;
    }
    return false
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
  public async deleteAllCart(@Ctx() ctx: ApiContext) {
    const cart = await Cart.findOne({ where: { userId: ctx.req.session!.token }});
    if(cart) {
      const result = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(CartProduct)
        .where("cartId= :cartId", {cartId: cart.id})
        .execute();
      return !!result.affected
    }
    return false
  }
}
