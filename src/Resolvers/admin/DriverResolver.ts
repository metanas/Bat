import {Arg, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Driver} from "../../entity/Driver";
import {getConnection} from "typeorm";
import {ceil} from "lodash";
import PaginatedResponse from "../../Modules/interfaces/PaginatedResponse";
import {PaginatedResponseInput} from "../../Modules/inputs/PaginatedResponseInput";


const PaginatedDriverResponse = PaginatedResponse(Driver);
// @ts-ignore
type PaginatedDriverResponse = InstanceType<typeof PaginatedDriverResponse>;

@Resolver()
export class DriverResolver {
  @UseMiddleware(Auth)
  @Query(() => Driver, {nullable: true})
  public async getDriver(@Arg("id") id: string): Promise<Driver | undefined> {
    return await Driver.findOne({where: {id}})
  }

  @UseMiddleware(Auth)
  @Mutation(() => Driver)
  public async addDriver(@Arg("name") name: string, @Arg("telephone") telephone: string,@Arg("point") point: number,@Arg("status") status: string, @Arg("longitude") longitude: string, @Arg("latitude") latitude: string) {
    return await Driver.create({
      name,
      telephone,
      point,
      status,
      longitude,
      latitude,
    }).save();
  }
  @UseMiddleware(Auth)
  @Mutation(() => Driver)
  public async updateDriverStatus(@Arg("id") id: string, @Arg("status") status: string){
    await getConnection()
      .createQueryBuilder()
      .update(Driver)
      .set({status})
      .where("id=:id", {id})
      .execute();
    return await this.getDriver(id)
  }

  @Mutation(() => Boolean)
  public async deleteDriver(@Arg("id") id: string) {
    const result = await getConnection().createQueryBuilder().delete().from(Driver)
      .where("id=:id", {id}).returning("id").execute();
    return !!result.affected
  }

  @Query(() => PaginatedDriverResponse)
  public async getDrivers(@Arg("data") { page, limit }: PaginatedResponseInput): Promise<PaginatedDriverResponse> {
    const result = await Driver.findAndCount({ skip: page - 1, take: limit });
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }

}