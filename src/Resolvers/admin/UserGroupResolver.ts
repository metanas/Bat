import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import { UserGroup } from "../../entity/UserGroup";
import { ceil } from "lodash";
import { PaginatedResponseArgs } from "../../Modules/inputs/PaginatedResponseArgs";
import { User } from "../../entity/User";
import { PaginatedUserGpResponse } from "../../types/PaginatedResponseTypes";

@Resolver()
export class UserGroupResolver {
  @Query(() => PaginatedUserGpResponse)
  public async getUserGroups(@Args() { page, limit }: PaginatedResponseArgs) {
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

  @Mutation(() => UserGroup)
  public async addUserGroup(
    @Arg("name") name: string,
    @Arg("permissions") permissions: string
  ) {
    return await UserGroup.create({
      name,
      permissions: JSON.parse(permissions),
    }).save();
  }

  @Mutation(() => UserGroup)
  public async updateUserGroup(
    @Arg("id") id: number,
    @Arg("name") name: string,
    @Arg("permissions") permissions: string
  ) {
    const userGroup = await UserGroup.createQueryBuilder()
      .update()
      .set({ name, permissions: JSON.parse(permissions) })
      .where("id=:id", { id })
      .returning(["id", "name", "permissions"])
      .execute();

    return userGroup.raw[0];
  }

  @Mutation(() => Boolean)
  public async deleteUserGroup(@Arg("id") id: number) {
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
