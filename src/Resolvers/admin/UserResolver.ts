import {Arg, Ctx, Mutation, Resolver} from "type-graphql";
import { AuthenticationError } from "apollo-server-express";
import {User} from "../../entity/User";
import bcrypt from "bcrypt";
import {UserGroup} from "../../entity/UserGroup";
import {ApiContext} from "../../types/ApiContext";

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  public async addUser(@Arg("name") name: string, @Arg("password") password: string, @Arg("userGroupId") userGroupId: number) {
    const hash = await bcrypt.hash(password, 12);
    const userGroup = await UserGroup.findOne(userGroupId);
    return await User.create({
      name,
      password: hash,
      userGroup
    }).save()
  }

  @Mutation(() => Boolean)
  public async login(@Ctx() ctx: ApiContext, @Arg("name") name: string, @Arg("password") password: string) {
    const user = await User.findOne({ where: { name }});
    if(user) {
      const isAuth = await bcrypt.compare(password, user.password);

      if(!isAuth) {
        throw new AuthenticationError("User and Password not register!")
      }
    } else {
      throw new AuthenticationError("User and Password not register!")
    }

    ctx.req.session!.token = user.id;
    ctx.req.session!.user = user;

    return true;
  }
}
