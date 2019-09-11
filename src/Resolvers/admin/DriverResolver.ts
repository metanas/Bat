import {Arg, Args, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Driver} from "../../entity/Driver";
import {ceil} from "lodash";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";
import {Order} from "../../entity/Order";
import {PaginatedDriverResponse} from "../../types/PaginatedResponseTypes";

@Resolver()
export class DriverResolver {
  @UseMiddleware(Auth)
  @Query(() => Driver, {nullable: true})
  public async getDriver(@Arg("id") id: number): Promise<Driver | undefined> {
    return await Driver.findOne(id)
  }

  @UseMiddleware(Auth)
  @Mutation(() => Driver)
  public async addDriver(@Arg("name") name: string, @Arg("telephone") telephone: string,@Arg("point") point: number,@Arg("avatar") avatar: string,@Arg("isActive") isActive: boolean, @Arg("longitude") longitude: string, @Arg("latitude") latitude: string) {
    return await Driver.create({
      name,
      telephone,
      point,
      avatar,
      isActive,
      longitude,
      latitude,
    }).save();
  }

  @UseMiddleware(Auth)
  @Mutation(() => Driver)
  public async updateDriverStatus(@Arg("id") id: number, @Arg("isActive") isActive: boolean){
    await Driver
      .createQueryBuilder()
      .update()
      .set({isActive})
      .where("id=:id", {id})
      .execute();
    return await this.getDriver(id)
  }

  @Mutation(() => Boolean)
  public async deleteDriver(@Arg("id") id: number) {
    const result = await Driver.createQueryBuilder().delete()
      .where("id=:id", {id}).returning("id").execute();
    return !!result.affected
  }

  @UseMiddleware(Auth)
  @Mutation(() => Driver)
  public async updateDriver(@Arg("id") id: number,@Arg("name") name: string,@Arg("telephone") telephone: string,@Arg("point") point: number,@Arg("avatar") avatar: string , @Arg("longitude") longitude: string,@Arg("latitude") latitude: string){
    await Driver
      .createQueryBuilder()
      .update()
      .set({ name, telephone, point,avatar,longitude,latitude})
      .where("id=:id",{ id })
      .execute();
    return await Driver.findOne(id);
  }

  @UseMiddleware(Auth)
  @Mutation(() => Order)
  public async setDriverToOrder(@Arg("id") id: number, @Arg("orderId") orderId: number) {
    const driver = await Driver.findOne(id);
    if(driver){
      await Order
        .createQueryBuilder()
        .update()
        .set( {driverName : driver.name , driver} )
        .where("orderId=:orderId",{orderId})
        .execute();
    }
    return await Order.findOne(orderId)
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedDriverResponse)
  public async getDrivers(@Args() { page, limit }: PaginatedResponseArgs) {
    const result = await Driver.findAndCount({ skip: (page - 1) * limit, take: limit });
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}
