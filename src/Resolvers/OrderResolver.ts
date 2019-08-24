import {Auth} from "../Middleware/Auth";
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {ApiContext} from "../types/ApiContext";
import {Order} from "../entity/Order";
import {User} from "../entity/User";
import {getConnection} from "typeorm";
import {PaginatedResponseInput} from "../Modules/inputs/PaginatedResponseInput";
import PaginatedResponse from "../Modules/interfaces/PaginatedResponse";
import {ceil} from "lodash";
import {OrderProduct} from "../entity/OrderProduct";
import {Cart} from "../entity/Cart";
import {Address} from "../entity/Address";
import {CartProduct} from "../entity/CartProduct";

const PaginatedOrderResponse = PaginatedResponse(Order);
// @ts-ignore
type PaginatedOrderResponse = InstanceType<typeof PaginatedOrderResponse>;

@Resolver()
export class OrderResolver {
  @UseMiddleware(Auth)
  @Query(() => Order, { nullable: true})
  public async getOrder(@Arg("id") id: number): Promise<Order | undefined> {
    const order = await Order.findOne(id);
    if(order) {
      order.orderProducts = await OrderProduct.find({
        join: {
          alias: "orderProduct",
          leftJoinAndSelect: {
            product: "orderProduct.product"
          }
        },
        where: {
          orderId: order.id
        }
      });
    }
    return order;
  }

  @UseMiddleware(Auth)
  @Mutation(() => Order)
  public async addOrder (@Ctx() ctx: ApiContext, @Arg("status") status: string,@Arg("driver") driver: string, @Arg("addressId") addressId: number){
    const user = await User.findOne({ where: { id: ctx.req.session!.token} });
    const cart = await Cart.findOne({ where: { user } });
    if(cart) {
      cart.cartProducts = await CartProduct.find({
        join: {
          alias: "cartProduct",
          leftJoinAndSelect: {
            product: "cartProduct.product"
          }
        },
        where: {
          cartId: cart.id
        }
      });
    }
    const address = await Address.findOne(addressId);
    const order = await Order.create({
      user,
      status,
      driver,
      address: address!.address,
    }).save();

    if(order && cart!.cartProducts) {
      cart!.cartProducts.forEach(function (cartProduct: CartProduct) {
        OrderProduct.create({
          order,
          product: cartProduct.product,
          price: cartProduct.product.priceUnit,
          quantity: cartProduct.quantity
        }).save();
      });
    }

    return await this.getOrder(order.id);
  }

  @UseMiddleware(Auth)
  @Mutation(() => Order)
  public async UpdateOrderStatus(@Arg("id") id: number, @Arg("status") status: string){
    return await getConnection()
      .createQueryBuilder()
      .update(Order)
      .set({status})
      .where("id=:id", {id})
      .execute();
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedOrderResponse)
  public async getOrders(@Ctx() ctx: ApiContext, @Arg("data") { page, limit }: PaginatedResponseInput ): Promise<PaginatedOrderResponse> {
    const result = await Order.findAndCount({where: { userId: ctx.req.session!.token }, skip: (page - 1) * limit, take: limit});
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}
