import {Arg, Args, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {AuthenticationError} from "apollo-server-express";
import {User} from "../../entity/User";
import bcrypt from "bcrypt";
import {UserGroup} from "../../entity/UserGroup";
import {ApiContext} from "../../types/ApiContext";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";
import {ceil, set} from "lodash";
import {PaginatedUserResponse} from "../../types/PaginatedResponseTypes";
import {UserArgs} from "../../Modules/inputs/UserArgs";
import {FindManyOptions, Raw} from "typeorm";

@Resolver()
export class UserResolver {
  @Query(() => PaginatedUserResponse)
  public async getUsers(@Arg("email", { nullable: true }) email: string, @Args() { name, limit, page }: PaginatedResponseArgs) {
    const options: FindManyOptions = { skip: (page-1) * limit, take: limit, order: { "create_at": "ASC"} };

    if (name) {
      set(options, "where.name", Raw(columnAlias => `lower(${columnAlias}) like '%${name.toLowerCase()}%'`))
    }

    if(email) {
      set(options, "where.email", Raw(columnAlias => `lower(${columnAlias}) like '%${email.toLowerCase()}%'`))
    }

    const result = await User.findAndCount(options);

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
  public async addUser(@Args() { email, name, password }: UserArgs,@Arg("userGroupId") userGroupId: number) {
    const hash = await bcrypt.hash(password, 12);
    const userGroup = await UserGroup.findOne(userGroupId);
    const user =await User.create({
      name,
      password: hash,
      email,
      userGroup
    }).save();

    return this.getUser(user.id);
  }

  @Mutation(() => User)
  public async login(@Ctx() ctx: ApiContext, @Args() { email, password }: UserArgs) {
    const user = await User.findOne({ where: { email }});

    if(!user) {
      throw new AuthenticationError("User and Password not register!")
    }

    const isAuth = await bcrypt.compare(password, user.password);

    if(!isAuth) {
      throw new AuthenticationError("User and Password not register!")
    }

    if(!user.active) {
      throw new AuthenticationError("Your account is disabled, please concat support for more information!")
    }

    ctx.req.session!.token = user.id;

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
