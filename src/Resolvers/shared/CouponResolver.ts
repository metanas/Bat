import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Coupon} from "../../entity/Coupon";
import {Auth} from "../../Middleware/Auth";
import {ApiContext} from "../../types/ApiContext";
import {Costumer} from "../../entity/Costumer";
import {CostumerCoupon} from "../../entity/CostumerCoupon";

@Resolver()
export class CouponResolver {
  @UseMiddleware(Auth)
  @Query(() => Coupon)
  public async getCoupon(@Arg("key") key: string) {
    const coupon = await Coupon.findOne({ where: { key } });
    if(!coupon || !coupon.isValid()) {
      throw new Error("Invalid Coupon Key!")
    }

    return coupon
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async setCouponToCostumer(@Ctx() ctx: ApiContext, @Arg("couponKey") key: string) {
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    const coupon = await Coupon.findOne({ where: { key } });

    if(!coupon || !coupon.isValid()) {
      throw new Error("Invalid Coupon!");
    }

    return !!await CostumerCoupon.create({
      costumer,
      coupon
    }).save();
  }
}
