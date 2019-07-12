import {Arg, Mutation, Query, Resolver} from 'type-graphql';
import {User} from "../entity/User";

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  public async me(): Promise<string | undefined> {
    return "hello world!";
  }

  @Mutation(() => User)
  public async register(@Arg("name") name: string, @Arg("telephone") telephone: string, @Arg("birthday") birthday: string): Promise<User> {
    return await User.create({
      name,
      telephone,
      birthday
    }).save();
  }

  @Mutation(() => User, { nullable: true })
  public async login(@Arg('telephone') telephone: string) {
    return await User.findOne({where: {telephone}});
  }
}
