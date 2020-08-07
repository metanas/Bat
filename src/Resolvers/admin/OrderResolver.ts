import {
  Arg,
  Args,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Order } from "../../entity/Order";
import {
  PaginatedOrderResponse,
  PaginatedOrderType,
} from "../../types/PaginatedResponseTypes";
import { PaginatedResponseArgs } from "../../Modules/inputs/PaginatedResponseArgs";
import { FindManyOptions } from "typeorm";
import { Driver } from "../../entity/Driver";
import { ceil } from "lodash";
import { Admin } from "../../Middleware/Admin";

@Resolver()
export class OrderResolver {
  @UseMiddleware(Admin)
  @Query(() => PaginatedOrderResponse)
  public async getOrders(
    @Arg("driverId") driverId: number,
    @Args() { page, limit }: PaginatedResponseArgs
  ): Promise<PaginatedOrderType> {
    const options: FindManyOptions = {
      skip: (page - 1) * limit,
      take: limit,
    };

    if (driverId) {
      const driver = await Driver.findOne(driverId);
      options.where = { driver };
    }

    const result = await Order.findAndCount(options);

    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1],
    };
  }

  @UseMiddleware(Admin)
  @Mutation(() => Order)
  public async updateOrderStatus(
    @Arg("id") id: string,
    @Arg("status") status: string
  ): Promise<Order | undefined> {
    const order = await Order.findOne(id);
    if (order) {
      await Order.createQueryBuilder()
        .update()
        .set({ status })
        .where("id=:id", { id: order.id })
        .execute();

      await order.reload();
    }
    return order;
  }

  @UseMiddleware(Admin)
  @Query(() => Order)
  public async getOrder(@Arg("id") id: string): Promise<Order | undefined> {
    return await Order.findOne(id);
  }
}
