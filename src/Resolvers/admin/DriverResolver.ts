import {Arg, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Driver} from "../../entity/Driver";
import {ceil} from "lodash";
import PaginatedResponse from "../../Modules/interfaces/PaginatedResponse";
import {PaginatedResponseInput} from "../../Modules/inputs/PaginatedResponseInput";
import {Order} from "../../entity/Order";


const PaginatedDriverResponse = PaginatedResponse(Driver);
// @ts-ignore
type PaginatedDriverResponse = InstanceType<typeof PaginatedDriverResponse>;

@Resolver()
export class DriverResolver {
  @UseMiddleware(Auth)
  @Query(() => Driver, {nullable: true})
  public async getDriver(@Arg("id") id: string): Promise<Driver | undefined> {
    const driver =  await Driver.findOne(id);
    if(driver) {
      driver.orders = await Order.find({
        join: {
          alias: "order",
          leftJoinAndSelect: {
            name: "order.driverName"
          }
        },
        where: {
          driverName: driver.name
        }
      });
    }
    return driver
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
  public async updateDriverStatus(@Arg("id") id: string, @Arg("isActive") isActive: boolean){
    await Driver
      .createQueryBuilder()
      .update()
      .set({isActive})
      .where("id=:id", {id})
      .execute();
    return await this.getDriver(id)
  }

  @Mutation(() => Boolean)
  public async deleteDriver(@Arg("id") id: string) {
    const result = await Driver.createQueryBuilder().delete()
      .where("id=:id", {id}).returning("id").execute();
    return !!result.affected
  }

  @UseMiddleware(Auth)
  @Mutation(() => Driver)
  public async updateDriver(@Arg("id") id: string,@Arg("name") name: string,@Arg("telephone") telephone: string,@Arg("point") point: number,@Arg("avatar") avatar: string , @Arg("longitude") longitude: string,@Arg("latitude") latitude: string){
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
  public async setDriverToOrder(@Arg("id") id: string, @Arg("orderId") orderId: number) {
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


  @Query(() => PaginatedDriverResponse)
  public async getDrivers(@Arg("data") { page, limit }: PaginatedResponseInput): Promise<PaginatedDriverResponse> {
    const result = await Driver.findAndCount({ skip: (page - 1) * limit, take: limit });
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}