import {Arg, Args, Mutation, Query, Resolver} from "type-graphql";
import {CouponInput} from "../../Modules/inputs/CouponInput";
import {Coupon} from "../../entity/Coupon";
import {CouponResolver as Base} from "../shared/CouponResolver";
import PaginatedResponse from "../../Modules/interfaces/PaginatedResponse";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";
import { ceil } from "lodash";

const PaginatedCouponResponse = PaginatedResponse(Coupon);
// @ts-ignore
type PaginatedCouponResponse = InstanceType<typeof PaginatedCouponResponse>;

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
  public async removeCoupon(@Arg("id") id: number) {
    const result = await Coupon.createQueryBuilder()
      .delete()
      .where("id=:id", { id })
      .execute();
    return !!result.affected
  }

  @Mutation(() => Coupon)
  public async updateCoupon(@Arg("data") {id, name, couponUse, dateBegin, dateEnd, discountAmount, discountPercent, discountType, key }: CouponInput) {
    await Coupon.createQueryBuilder()
      .update()
      .set({
        name,
        couponUse,
        dateBegin,
        dateEnd,
        key,
        discountType,
        discountPercent,
        discountAmount
      })
      .where("id=:id", { id })
      .execute();
    return await Coupon.findOne(id);
  }

  @Query(() => PaginatedCouponResponse)
  public async getCoupons(@Args() { page, limit }: PaginatedResponseArgs) {
    const result = await Coupon.findAndCount({ skip: (page - 1) * limit, take: limit, order: { id: "ASC" }});
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    }
  }
}
