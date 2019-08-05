import {Auth} from "../Middleware/Auth";
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {ApiContext} from "../types/ApiContext";
import {Order} from "../entity/Order";
import {User} from "../entity/User";
import {Coupon} from "../entity/Coupon";
import {getConnection} from "typeorm";

@Resolver()
export class OrderResolver {
  @UseMiddleware(Auth)
  @Query(() => Order, { nullable: true})
  public async getOrder(@Ctx() ctx: ApiContext): Promise<Order | undefined> {
    return await Order.findOne({where: {"idUser": ctx.req.session!.token}, relations: ["order_product"] })
  }

  @UseMiddleware(Auth)
  @Mutation(() => Order)
  public async addOrder (@Ctx() ctx: ApiContext, @Arg("orderDate") orderDate: number,@Arg("paymentMethod") paymentMethod: string,@Arg("status") status :string,@Arg("driver") driver: string,@Arg("address") address :string,@Arg("idCoupon") idCoupon?: number , ){
    const user = await User.findOne({ where: { id: ctx.req.session!.token} });
    const coupon = await Coupon.findOne({ where: { id: idCoupon} });
    return await Order.create({
      user,
      coupon,
      orderDate,
      paymentMethod,
      status,
      driver,
      address
    }).save();
    }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async deleteOrder(@Arg("id") id: number) {
    const order = getConnection().createQueryBuilder().delete().from(Order)
      .where("id=:id", {id}).execute();
    return !!order
  }
}