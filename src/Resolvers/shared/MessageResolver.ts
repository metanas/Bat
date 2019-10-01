import {Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Message} from "../../entity/Message";
import {getConnection} from "typeorm";
import {Costumer} from "../../entity/Costumer";
import {ApiContext} from "../../types/ApiContext";
import {ceil} from "lodash";
import {PaginatedMessageResponse} from "../../types/PaginatedResponseTypes";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";


@Resolver()
export class MessageResolver {
  @UseMiddleware(Auth)
  @Query(() => Message, { nullable: true})
  public async getMessage(@Arg("id") id: number): Promise<Message | undefined> {
    return await Message.findOne(id)
  }

  @UseMiddleware(Auth)
  @Mutation(() => Message)
  public async addMessage(@Ctx() ctx: ApiContext, @Arg("creatorId") creatorId: string, @Arg("content") content: string) {
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    return await Message.create({
      creatorId,
      content,
      costumer
    }).save();
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async deleteMessage(@Arg("id") id: number) {
    const result = await getConnection().createQueryBuilder().delete().from(Message)
      .where("id=:id", {id}).returning("id").execute();
    return !!result.affected
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedMessageResponse)
  public async getMessages(@Ctx() ctx: ApiContext, @Args() { page, limit }: PaginatedResponseArgs ) {
    const costumer = await Costumer.findOne({ where: { id: ctx.req.session!.token }});
    const result = await Message.findAndCount({where: {costumer}, skip: (page - 1) * limit, take: limit});
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }

}