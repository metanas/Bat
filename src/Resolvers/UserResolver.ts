import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {User} from "../entity/User";
import {UserInput} from "../Modules/inputs/UserInput";
import {Auth} from "../Middleware/Auth";
import {ApiContext} from "../types/ApiContext";

@Resolver()
export class UserResolver {
  @UseMiddleware(Auth)
  @Query(() => User, { nullable: true })
  public async me(@Ctx() ctx: ApiContext): Promise<User | undefined> {
    return await User.findOne({ where: { id: ctx.req.session!.token }});
  }

  @Mutation(() => User)
  public async register(@Arg("data") {name, telephone, birthday}: UserInput): Promise<User> {
    return await User.create({
      name,
      telephone,
      birthday
    }).save();
  }

  @Mutation(() => User, { nullable: true })
  public async login(@Ctx() ctx: ApiContext, @Arg("telephone") telephone: string) {
    const user = await User.findOne({ where: {telephone} });

    if(!user) {
      throw new Error("This telephone number isn't register!")
    }

    ctx.req.session!.token = user.id;

    return User
  }
}
