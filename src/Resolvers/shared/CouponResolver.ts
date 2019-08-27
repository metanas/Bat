import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Coupon} from "../../entity/Coupon";
import {Auth} from "../../Middleware/Auth";
import {ApiContext} from "../../types/ApiContext";
import {User} from "../../entity/User";
import {UserCoupon} from "../../entity/UserCoupon";


@Resolver()
export class CouponResolver {
  @UseMiddleware(Auth)
  @Query(() => Coupon)
  public async getCoupon(@Arg("key") key: string) {
    const coupon = await Coupon.findOne({where: {key},
      join: {
        alias: "CouponProduct",
        leftJoinAndSelect: {
          product: "CouponProduct.product"
        }
      },
      relations: ["order"]
    });
    if(!coupon || !coupon.isValid()) {
      throw new Error("Invalid Coupon Key!")
    }

    return coupon
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async setCouponToUser(@Ctx() ctx: ApiContext, @Arg("couponKey") key: string) {
    const user = await User.findOne(ctx.req.session!.token);
    const coupon = await Coupon.findOne({ where: { key } });
    return !!await UserCoupon.create({
      user,
      coupon
    }).save();
  }
}
