import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Costumer} from "../../entity/Costumer";
import {CostumerInput} from "../../Modules/inputs/CostumerInput";
import {Auth} from "../../Middleware/Auth";
import {ApiContext} from "../../types/ApiContext";
import {Cart} from "../../entity/Cart";

@Resolver()
export class CostumerResolver {
  @UseMiddleware(Auth)
  @Query(() => Costumer, { nullable: true })
  public async me(@Ctx() ctx: ApiContext): Promise<Costumer | undefined> {


    return await Costumer.findOne({ where: { id: ctx.req.session!.token }});
  }

  @Mutation(() => Costumer)
  public async register(@Arg("data") {name, telephone, birthday}: CostumerInput): Promise<Costumer> {
    const costumer = await Costumer.create({
      name,
      telephone,
      birthday
    }).save();
    await Cart.create({
      costumer
    }).save();
    return costumer
  }

  @Mutation(() => Costumer)
  public async login(@Ctx() ctx: ApiContext, @Arg("telephone") telephone: string): Promise<Costumer> {
    const costumer = await Costumer.findOne({ where: {telephone} });

    if(!costumer) {
      throw new Error("This telephone number isn't register!")
    }

    ctx.req.session!.token = costumer.id;

    return costumer
  }
}
