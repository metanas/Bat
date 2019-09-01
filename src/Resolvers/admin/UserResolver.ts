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

  @Mutation(() => Boolean)
  public async deleteUser(@Arg("id") id: number) {
    const result = await User.createQueryBuilder()
      .delete()
      .where("id=:id", { id })
      .execute();

    return !!result.affected
  }
}
