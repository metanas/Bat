import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { AuthenticationError } from "apollo-server-express";
import { User } from "../../entity/User";
import { UserGroup } from "../../entity/UserGroup";
import { ApiContext } from "../../types/ApiContext";
import { PaginatedResponseArgs } from "../../Modules/inputs/PaginatedResponseArgs";
import { ceil, set } from "lodash";
import { PaginatedUserResponse } from "../../types/PaginatedResponseTypes";
import { UserArgs } from "../../Modules/inputs/UserArgs";
import { FindManyOptions, getConnection, Like } from "typeorm";
import { compare, hash } from "bcryptjs";
import { sendRefreshToken } from "../../utils/sendRefreshToken";
import { createAccessToken, createRefreshToken } from "../../utils/tokenGen";
import { verify } from "jsonwebtoken";
import "dotenv/config";
import { Admin } from "../../Middleware/Admin";

@Resolver()
export class UserResolver {
  @UseMiddleware(Admin)
  @Query(() => PaginatedUserResponse)
  public async getUsers(
    @Arg("email", { nullable: true }) email: string,
    @Args() { name, limit, page }: PaginatedResponseArgs
  ): Promise<PaginatedUserResponse> {
    const options: FindManyOptions = {
      skip: (page - 1) * limit,
      take: limit,
      order: { create_at: "ASC" },
    };

    if (name) {
      set(options, "where.name", Like(name));
    }

    if (email) {
      set(options, "where.email", Like(email));
    }

    const result = await User.findAndCount(options);

    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1],
    };
  }

  @UseMiddleware(Admin)
  @Query(() => User)
  public async getUser(@Arg("id") id: string): Promise<User | undefined> {
    return await User.findOne(id, { relations: ["userGroup"] });
  }

  @UseMiddleware(Admin)
  @Mutation(() => User)
  public async addUser(
    @Args() { email, name, password }: UserArgs,
    @Arg("userGroupId") userGroupId: number
  ): Promise<User | undefined> {
    const passwordHashed = await hash(password, 12);
    const userGroup = await UserGroup.findOne(userGroupId);
    const user = await User.create({
      name,
      password: passwordHashed,
      email,
      userGroup,
    }).save();

    return this.getUser(user.id);
  }

  @UseMiddleware(Admin)
  @Mutation(() => Boolean)
  public async revokeRefreshTokensForUser(
    @Arg("userId") userId: string
  ): Promise<boolean> {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  @Mutation(() => User)
  public async login(
    @Ctx() ctx: ApiContext,
    @Args() { email, password }: UserArgs
  ): Promise<User> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new AuthenticationError("User and Password not register!");
    }

    const isAuth = await compare(password, user.password);

    if (!isAuth) {
      throw new AuthenticationError("User and Password not register!");
    }

    if (!user.active) {
      throw new AuthenticationError(
        "Your account is disabled, please concat support for more information!"
      );
    }

    ctx.res.set("Access-Control-Expose-Headers", ["x-token"]);
    sendRefreshToken(ctx.res, createRefreshToken(user));
    ctx.res.setHeader("x-token", createAccessToken(user));

    return user;
  }

  @UseMiddleware(Admin)
  @Query(() => User, { nullable: true })
  public async me(@Ctx() ctx: ApiContext): Promise<User | undefined> {
    const authorization = ctx.req.headers["authorization"];

    if (!authorization) {
      throw new Error("You should Sign In!");
    }

    try {
      const token = authorization?.split(" ")[1];
      const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!) as Record<
        string,
        string
      >;
      return await User.findOne(payload.userId);
    } catch (e) {
      throw new Error("Error");
    }
  }

  @UseMiddleware(Admin)
  @Mutation(() => Boolean)
  public async logout(@Ctx() ctx: ApiContext): Promise<boolean> {
    sendRefreshToken(ctx.res, "");

    return true;
  }

  @UseMiddleware(Admin)
  @Mutation(() => Boolean)
  public async deleteUser(@Arg("id") id: string): Promise<boolean> {
    const result = await User.createQueryBuilder()
      .delete()
      .where("id=:id", { id })
      .execute();

    return !!result.affected;
  }
}
