import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {User} from "../../entity/User";
import {UserInput} from "../../Modules/inputs/UserInput";
import {Auth} from "../../Middleware/Auth";
import {ApiContext} from "../../types/ApiContext";
import {Cart} from "../../entity/Cart";

@Resolver()
export class UserResolver {
  @UseMiddleware(Auth)
  @Query(() => User, { nullable: true })
  public async me(@Ctx() ctx: ApiContext): Promise<User | undefined> {
    return await User.findOne({ where: { id: ctx.req.session!.token }});
  }

  @Mutation(() => User)
  public async register(@Arg("data") {name, telephone, birthday}: UserInput): Promise<User> {
    const user = await User.create({
      name,
      telephone,
      birthday
    }).save();
    await Cart.create({
      user
    }).save();
    return user
  }

  @Mutation(() => User)
  public async login(@Ctx() ctx: ApiContext, @Arg("telephone") telephone: string): Promise<User> {
    const user = await User.findOne({ where: {telephone} });

    if(!user) {
      throw new Error("This telephone number isn't register!")
    }

    ctx.req.session!.token = user.id;

    return user
  }
}
