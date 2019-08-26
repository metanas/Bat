import {Arg, Mutation, Resolver, UseMiddleware} from "type-graphql";
import { OrderResolver as Base } from "../shared/OrderResolver";
import {Auth} from "../../Middleware/Auth";
import {Order} from "../../entity/Order";
import {getConnection} from "typeorm";

@Resolver()
export class OrderResolver extends Base {
  @UseMiddleware(Auth)
  @Mutation(() => Order)
  public async updateOrderStatus(@Arg("id") id: number, @Arg("status") status: string){
    await getConnection()
      .createQueryBuilder()
      .update(Order)
      .set({status})
      .where("id=:id", {id})
      .execute();
    return await this.getOrder(id)
  }
}
