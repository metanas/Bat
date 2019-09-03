import {Arg, Args, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {AuthenticationError} from "apollo-server-express";
import {User} from "../../entity/User";
import bcrypt from "bcrypt";
import {UserGroup} from "../../entity/UserGroup";
import {ApiContext} from "../../types/ApiContext";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";
import PaginatedResponse from "../../Modules/interfaces/PaginatedResponse";
import { ceil } from "lodash";

const PaginatedUserResponse = PaginatedResponse(User);
// @ts-ignore
type PaginatedUserResponse = InstanceType<typeof PaginatedUserResponse>;

@Resolver()
export class UserResolver {
  @Query(() => PaginatedUserResponse)
  public async getUsers(@Args() { limit, page }: PaginatedResponseArgs) {
    const result = await User.findAndCount({skip: (page-1) * limit, take: limit, order: { "create_at": "ASC"}, relations: ["userGroup"]});

    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    }
  }

  @Query(() => User)
  public async getUser(@Arg("id") id: string) {
    return await User.findOne(id, {relations: ["userGroup"]});
  }

  @Mutation(() => User)
  public async addUser(@Arg("name") name: string, @Arg("password") password: string, @Arg("userGroupId") userGroupId: number) {
    const hash = await bcrypt.hash(password, 12);
    const userGroup = await UserGroup.findOne(userGroupId);
    const user =await User.create({
      name,
      password: hash,
      userGroup
    }).save();

    return this.getUser(user.id);
  }

  @Mutation(() => User)
  public async login(@Ctx() ctx: ApiContext, @Arg("name") name: string, @Arg("password") password: string) {
    const user = await User.findOne({ where: { name }, relations: ["userGroup"]});
    if(user) {
      const isAuth = await bcrypt.compare(password, user.password);

      if(!isAuth) {
        throw new AuthenticationError("User and Password not register!")
      }

      ctx.req.session!.token = user.id;
      ctx.req.session!.user = user;
    }

    return user;
  }

  @Mutation(() => Boolean)
  public async deleteUser(@Arg("id") id: string) {
    const result = await User.createQueryBuilder()
      .delete()
      .where("id=:id", { id })
      .execute();

    return !!result.affected
  }
}
