import {Arg, Mutation, Resolver} from "type-graphql";
import {CouponInput} from "../../Modules/inputs/CouponInput";
import {Coupon} from "../../entity/Coupon";
import { CouponResolver as Base } from "../shared/CouponResolver";

@Resolver()
export class CouponResolver extends Base {
  // // TODO Admin PERMISSION
  @Mutation(() => Coupon)
  public async addCoupon(@Arg("data") { name, couponUse, dateBegin, dateEnd, discountAmount, discountPercent, discountType, key }: CouponInput) {
    return await Coupon.create({
      name,
      couponUse,
      key,
      dateBegin,
      dateEnd,
      discountAmount,
      discountPercent,
      discountType
    }).save();
  }

  @Mutation(() => Boolean)
  public async removeCoupon(@Arg("key") key: string) {
    const result = await Coupon.createQueryBuilder()
      .delete()
      .where("key=:key", { key })
      .execute();
    return !!result.affected
  }

  @Mutation(() => Coupon)
  public async updateCoupon(@Arg("data") {name, couponUse, dateBegin, dateEnd, discountAmount, discountPercent, discountType, key }: CouponInput) {
    await Coupon.createQueryBuilder()
      .update()
      .set({
        name,
        couponUse,
        dateBegin,
        dateEnd,
        discountType,
        discountPercent,
        discountAmount
      })
      .where("key=:key", { key })
      .execute();
    return await super.getCoupon(key)
  }
}
