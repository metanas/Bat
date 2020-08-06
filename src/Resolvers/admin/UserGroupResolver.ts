import {
  Arg,
  Args,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { UserGroup } from "../../entity/UserGroup";
import { ceil } from "lodash";
import { PaginatedResponseArgs } from "../../Modules/inputs/PaginatedResponseArgs";
import { User } from "../../entity/User";
import { PaginatedUserGpResponse } from "../../types/PaginatedResponseTypes";
import { Admin } from "../../Middleware/Admin";

@Resolver()
export class UserGroupResolver {
  @UseMiddleware(Admin)
  @Query(() => PaginatedUserGpResponse)
  public async getUserGroups(
    @Args() { page, limit }: PaginatedResponseArgs
  ): Promise<PaginatedUserGpResponse> {
    const result = await UserGroup.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1],
    };
  }

  @UseMiddleware(Admin)
  @Mutation(() => UserGroup)
  public async addUserGroup(
    @Arg("name") name: string,
    @Arg("permissions") permissions: string
  ): Promise<UserGroup> {
    return await UserGroup.create({
      name,
      permissions: JSON.parse(permissions),
    }).save();
  }

  @UseMiddleware(Admin)
  @Mutation(() => UserGroup)
  public async updateUserGroup(
    @Arg("id") id: number,
    @Arg("name") name: string,
    @Arg("permissions") permissions: string
  ): Promise<UserGroup> {
    const userGroup = await UserGroup.createQueryBuilder()
      .update()
      .set({ name, permissions: JSON.parse(permissions) })
      .where("id=:id", { id })
      .returning(["id", "name", "permissions"])
      .execute();

    return userGroup.raw[0];
  }

  @UseMiddleware(Admin)
  @Mutation(() => Boolean)
  public async deleteUserGroup(@Arg("id") id: number): Promise<boolean> {
    const userGroup = await UserGroup.findOne({ where: { id } });
    const userCount = await User.count({ where: { userGroup } });

    if (userCount > 0) {
      throw new Error("This Group is already used!!");
    }

    const result = await UserGroup.createQueryBuilder()
      .delete()
      .where("id=:id", { id })
      .execute();
    return !!result.affected;
  }
}
