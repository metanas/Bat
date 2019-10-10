import {Arg, Mutation, Resolver, UseMiddleware, Query, Args} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Order} from "../../entity/Order";
import {PaginatedOrderResponse} from "../../types/PaginatedResponseTypes";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";
import {FindManyOptions} from "typeorm";
import {Driver} from "../../entity/Driver";
import { ceil } from "lodash";

@Resolver()
export class OrderResolver {
  @Query(() => PaginatedOrderResponse)
  public async getOrders(@Arg("driverId", {nullable: true}) driverId: number, @Args() { page, limit }: PaginatedResponseArgs) {
    const options: FindManyOptions = {
      skip: (page - 1) * limit,
      take: limit,
      order: { "create_at": "DESC" }
    };

    if(driverId) {
      const driver = await Driver.findOne(driverId);
      options.where = { driver }
    }

    const result = await Order.findAndCount(options);

    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    }
  }

  @UseMiddleware(Auth)
  @Mutation(() => Order)
  public async updateOrderStatus(@Arg("id") id: string, @Arg("status") status: string){
    const order = await Order.findOne(id);
    if(order) {
      await Order
        .createQueryBuilder()
        .update()
        .set({status})
        .where("id=:id", {id: order.id})
        .execute();

      await order.reload()
    }
    return order;
  }

  @Query(() => Order)
  public async getOrder(@Arg("id") id: string) {
    return await Order.findOne(id);
  }
}
