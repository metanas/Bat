import {Arg, Args, Mutation, Query, Resolver} from "type-graphql";
import {UserGroup} from "../../entity/UserGroup";
import PaginatedResponse from "../../Modules/interfaces/PaginatedResponse";
import {ceil} from "lodash";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";

const PaginatedUserGroupResponse = PaginatedResponse(UserGroup);
// @ts-ignore
type PaginatedUserGroupResponse = InstanceType<typeof PaginatedUserGroupResponse>;

@Resolver()
export class UserGroupResolver {
  @Query(() => PaginatedUserGroupResponse)
  public async getUserGroups(@Args() { page, limit }: PaginatedResponseArgs): Promise<PaginatedUserGroupResponse> {
    const result = await UserGroup.findAndCount({ skip: (page - 1) * limit, take: limit });
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    }
  }

  @Mutation(() => Boolean)
  public async addUserGroup(@Arg("name") name: string, @Arg("permissions") permissions: string) {
    console.log(JSON.parse(permissions));
    return !!UserGroup.create({
      name,
      permissions: JSON.parse(permissions)
    }).save()
  }

  @Mutation(() => UserGroup)
  public async updateUserGroup(@Arg("id") id: number,@Arg("name") name: string, @Arg("permissions") permissions: string) {
    const userGroup = await UserGroup.createQueryBuilder().update()
      .set({ name,
        permissions: JSON.parse(permissions)
      })
      .where("id=:id", {id})
      .returning(["id", "name", "permissions"])
      .execute();

    return userGroup.raw[0]
  }
}
