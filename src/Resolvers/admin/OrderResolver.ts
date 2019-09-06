import {Arg, Mutation, Resolver, UseMiddleware} from "type-graphql";
import {OrderResolver as Base} from "../shared/OrderResolver";
import {Auth} from "../../Middleware/Auth";
import {Order} from "../../entity/Order";

@Resolver()
export class OrderResolver extends Base {
  @UseMiddleware(Auth)
  @Mutation(() => Order)
  public async updateOrderStatus(@Arg("id") id: number, @Arg("status") status: string){
    await Order
      .createQueryBuilder()
      .update()
      .set({status})
      .where("id=:id", {id})
      .execute();
    return await this.getOrder(id)
  }
}
