import {Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Message} from "../../entity/Message";
import {Costumer} from "../../entity/Costumer";
import {ApiContext} from "../../types/ApiContext";
import {ceil} from "lodash";
import {PaginatedMessageResponse} from "../../types/PaginatedResponseTypes";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";


@Resolver()
export class MessageResolver {


  @UseMiddleware(Auth)
  @Mutation(() => Message)
  public async addMessage(@Ctx() ctx: ApiContext, @Arg("content") content: string) {
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    return await Message.create({
      content,
      costumer
    }).save();
  }


  @UseMiddleware(Auth)
  @Query(() => PaginatedMessageResponse)
  public async getMessages(@Ctx() ctx: ApiContext, @Args() { page, limit }: PaginatedResponseArgs ) {
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    const result = await Message.findAndCount({where: {costumer}, skip: (page - 1) * limit, take: limit, order: {create_at:"DESC"}});
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }

}