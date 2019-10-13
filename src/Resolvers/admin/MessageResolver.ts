import {Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Message} from "../../entity/Message";
import {Costumer} from "../../entity/Costumer";
import {ApiContext} from "../../types/ApiContext";
import {ceil} from "lodash";
import {PaginatedMessageResponse} from "../../types/PaginatedResponseTypes";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";
import {Product} from "../../entity/Product";


@Resolver()
export class MessageResolver {

  @UseMiddleware(Auth)
  @Mutation(() => Message)
  public async addMessage(@Ctx() ctx: ApiContext, @Arg("content") content: string, @Arg("byAdmin") byAdmin : boolean = true) {
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    return await Message.create({
      content,
      byAdmin,
      costumer
    }).save();
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedMessageResponse)
  public async getMessages(@Args() { page, limit }: PaginatedResponseArgs ) {
    const result = await Message.findAndCount({skip: (page - 1) * limit, take: limit,  order:{create_at:'DESC'}});
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedMessageResponse)
  public async getMessagesGroupedByCostumer(@Args() { page, limit }: PaginatedResponseArgs ) {
    let query = Product
      .createQueryBuilder("message")
      .select()
      .groupBy('costumer')
      .orderBy({create_at:'DESC'});
    const result = await query.take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}