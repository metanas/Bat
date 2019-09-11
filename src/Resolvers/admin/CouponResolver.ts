import {Arg, Args, Mutation, Query, Resolver} from "type-graphql";
import {CouponArgs} from "../../Modules/inputs/CouponArgs";
import {Coupon} from "../../entity/Coupon";
import {CouponResolver as Base} from "../shared/CouponResolver";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";
import {ceil} from "lodash";
import {PaginatedCouponResponse} from "../../types/PaginatedResponseTypes";

@Resolver()
export class CouponResolver extends Base {
  // // TODO Admin PERMISSION
  @Mutation(() => Coupon)
  public async addCoupon(@Args() args: CouponArgs) {
    return await Coupon.create({
      name: args.name,
      couponUse: args.couponUse,
      dateBegin: args.dateBegin,
      dateEnd: args.dateEnd,
      key: args.key,
      discountType: args.discountType,
      discountPercent: args.discountPercent,
      discountAmount: args.discountAmount
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
  public async updateCoupon(@Arg("id") id: number, @Args() args: CouponArgs) {
    await Coupon.createQueryBuilder()
      .update()
      .set({
        name: args.name,
        couponUse: args.couponUse,
        dateBegin: args.dateBegin,
        dateEnd: args.dateEnd,
        key: args.key,
        discountType: args.discountType,
        discountPercent: args.discountPercent,
        discountAmount: args.discountAmount
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
