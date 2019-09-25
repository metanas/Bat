import {Arg, Args, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {AuthenticationError} from "apollo-server-express";
import {User} from "../../entity/User";
import {UserGroup} from "../../entity/UserGroup";
import {ApiContext} from "../../types/ApiContext";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";
import {ceil, set} from "lodash";
import {PaginatedUserResponse} from "../../types/PaginatedResponseTypes";
import {UserArgs} from "../../Modules/inputs/UserArgs";
import {FindManyOptions, getConnection, Raw} from "typeorm";
import { hash, compare } from "bcryptjs";
import {sendRefreshToken} from "../../utils/sendRefreshToken";
import {createAccessToken, createRefreshToken} from "../../utils/tokenGen";
import {LoginResponse} from "../../Modules/LoginResponse";
import {verify} from "jsonwebtoken";
import "dotenv/config";

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
    const passwordHashed = await hash(password, 12);
    const userGroup = await UserGroup.findOne(userGroupId);
    const user =await User.create({
      name,
      password: passwordHashed,
      email,
      userGroup
    }).save();

    return this.getUser(user.id);
  }
  @Mutation(() => Boolean)
  public async revokeRefreshTokensForUser(@Arg("userId") userId: string): Promise<boolean> {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }
  @Mutation(() => LoginResponse)
  public async login(@Ctx() ctx: ApiContext, @Args() { email, password }: UserArgs) {
    const user = await User.findOne({ where: { email }});

    if(!user) {
      throw new AuthenticationError("User and Password not register!")
    }

    const isAuth = await compare(password, user.password);

    if(!isAuth) {
      throw new AuthenticationError("User and Password not register!")
    }

    if(!user.active) {
      throw new AuthenticationError("Your account is disabled, please concat support for more information!")
    }

    sendRefreshToken(ctx.res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user
    };
  }

  @Query(() => User, { nullable: true })
  public async me(@Ctx() ctx: ApiContext) {
    const authorization = ctx.req.headers["authorization"];

    if(!authorization) {
      return Error("You should Sign In!");
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return await User.findOne(payload.userId);
    } catch (e) {
      return Error("Error");
    }
  }


  @Mutation(() => Boolean)
  public async logout(@Ctx() ctx: ApiContext) {
    sendRefreshToken(ctx.res, "");

    return true;
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
