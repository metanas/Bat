import {Auth} from "../../Middleware/Auth";
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Cart} from "../../entity/Cart";
import {ApiContext} from "../../types/ApiContext";
import {Coupon} from "../../entity/Coupon";
import {CartProduct} from "../../entity/CartProduct";
import {Costumer} from "../../entity/Costumer";
import {Product} from "../../entity/Product";

@Resolver()
export class CartResolver {
  @UseMiddleware(Auth)
  @Query(() => Cart, { nullable: true})
  public async getCart(@Ctx() ctx: ApiContext): Promise<Cart | undefined> {
    const costumer = await Costumer.findOne(ctx.req.session!.token );
    return await Cart.findOne({where: {costumer}})
  }

  @UseMiddleware(Auth)
  @Mutation(() => Cart)
  public async setCouponToCart (@Ctx() ctx: ApiContext, @Arg("key") key: string){
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    const coupon = await Coupon.findOne({ where: { key } });
    if(!coupon) {
      throw new Error("Invalid Coupon !!")
    }
    await Cart.createQueryBuilder()
      .update()
      .set({ coupon })
      .where("costumerId=:id", { id: costumer!.id})
      .execute();
    return Cart.findOne({ where: { costumer }});
  }

  @UseMiddleware(Auth)
  @Mutation(() => Cart)
  public async addProductToCart(@Ctx() ctx: ApiContext, @Arg("productId") productId: number, @Arg("quantity") quantity: number) {
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    const cart = await Cart.findOne({where: { costumer }});
    const product = await Product.findOne(productId);
    if(product) {
      if (quantity > product!.quantity) {
        throw new Error("Quantity Selected is Not Available");
      }
    }

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
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    const cart = await Cart.findOne({ where: { costumer }});
    const result = await CartProduct.createQueryBuilder().delete()
      .where("cartId=:id", { id: cart!.id })
      .execute();
    return !!result.affected
  }

  @Mutation(() => Cart)
  @UseMiddleware(Auth)
  public async updateProductQuantity(@Ctx() ctx: ApiContext, @Arg("productId") productId: number, @Arg("quantity") quantity: number) {
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    const cart = await Cart.findOne({ where: { costumer }});
    const product = await Product.findOne(productId);

    if(product && product.quantity < quantity) {
      throw new Error("Quantity Selected is Not Available");
    }

    if(cart && product) {
      await CartProduct.createQueryBuilder()
        .update()
        .set({
          quantity
        })
        .where("cartId=:cartId", { cartId: cart.id })
        .andWhere("productId=:productId", { productId: product.id })
        .execute();
    }

    return await this.getCart(ctx)
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  public async removeProductFromCart(@Ctx() ctx: ApiContext, @Arg("productId") productId: number) {
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    const cart = await Cart.findOne({ where: { costumer }});
    if(cart) {
      const result = await CartProduct
        .createQueryBuilder()
        .delete()
        .where("productId=:productId", {productId})
        .execute();
      return !!result.affected;
    }
    return false
  }
}
