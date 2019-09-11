import {Auth} from "../../Middleware/Auth";
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {ApiContext} from "../../types/ApiContext";
import {Order} from "../../entity/Order";
import {Costumer} from "../../entity/Costumer";
import {PaginatedResponseInput} from "../../Modules/inputs/PaginatedResponseInput";
import PaginatedResponse from "../../Modules/interfaces/PaginatedResponse";
import {ceil} from "lodash";
import {OrderProduct} from "../../entity/OrderProduct";
import {Cart} from "../../entity/Cart";
import {Address} from "../../entity/Address";

const PaginatedOrderResponse = PaginatedResponse(Order);
// @ts-ignore
type PaginatedOrderResponse = InstanceType<typeof PaginatedOrderResponse>;

@Resolver()
export class OrderResolver {
  @UseMiddleware(Auth)
  @Query(() => Order, { nullable: true})
  public async getOrder(@Arg("id") id: number): Promise<Order | undefined> {
    return await Order.findOne(id);
  }

  @UseMiddleware(Auth)
  @Mutation(() => Order)
  public async addOrder (@Ctx() ctx: ApiContext,  @Arg("addressId") addressId: number){
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    const cart = await Cart.findOne({ where: { costumer } });

    if(cart && cart.count() === 0){
      throw new Error("Your Cart is Empty")
    }

    const address = await Address.findOne(addressId);

    if(!address) {
      throw new Error("Please set Address!")
    }

    const order = await Order.create({
      costumer,
      address: address.address,
    }).save();

    if(order && cart!.cartProducts) {
      for(let i=0; i < cart!.cartProducts.length; i++){
        await OrderProduct.create({
          order,
          product: cart!.cartProducts[i].product,
          price: cart!.cartProducts[i].product.priceCent,
          quantity: cart!.cartProducts[i].quantity
        }).save();
      }
    }

    return await Order.findOne(order.id);
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedOrderResponse)
  public async getOrders(@Ctx() ctx: ApiContext, @Arg("data") { page, limit }: PaginatedResponseInput ): Promise<PaginatedOrderResponse> {
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    const result = await Order.findAndCount({ where: { costumer }, order: { id: "DESC" }, skip: (page - 1) * limit, take: limit});
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}
