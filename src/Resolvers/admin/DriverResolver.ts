import {
  Arg,
  Args,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Driver } from "../../entity/Driver";
import { ceil } from "lodash";
import { PaginatedResponseArgs } from "../../Modules/inputs/PaginatedResponseArgs";
import { Order } from "../../entity/Order";
import {
  PaginatedDriverResponse,
  PaginatedDriverType,
} from "../../types/PaginatedResponseTypes";
import { Admin } from "../../Middleware/Admin";

@Resolver()
export class DriverResolver {
  @UseMiddleware(Admin)
  @Query(() => Driver, { nullable: true })
  public async getDriver(@Arg("id") id: number): Promise<Driver | undefined> {
    return await Driver.findOne(id);
  }

  @UseMiddleware(Admin)
  @Mutation(() => Driver)
  public async addDriver(
    @Arg("name") name: string,
    @Arg("telephone") telephone: string,
    @Arg("point") point: number,
    @Arg("avatar") avatar: string,
    @Arg("isActive") isActive: boolean,
    @Arg("longitude") longitude: string,
    @Arg("latitude") latitude: string
  ): Promise<Driver> {
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

  @UseMiddleware(Admin)
  @Mutation(() => Driver)
  public async updateDriverStatus(
    @Arg("id") id: number,
    @Arg("isActive") isActive: boolean
  ): Promise<Driver | undefined> {
    await Driver.createQueryBuilder()
      .update()
      .set({ isActive })
      .where("id=:id", { id })
      .execute();
    return await Driver.findOne(id);
  }

  @UseMiddleware(Admin)
  @Mutation(() => Boolean)
  public async deleteDriver(@Arg("id") id: number): Promise<boolean> {
    const result = await Driver.createQueryBuilder()
      .delete()
      .where("id=:id", { id })
      .returning("id")
      .execute();
    return !!result.affected;
  }

  @UseMiddleware(Admin)
  @Mutation(() => Driver)
  public async updateDriver(
    @Arg("id") id: number,
    @Arg("name") name: string,
    @Arg("telephone") telephone: string,
    @Arg("point") point: number,
    @Arg("avatar") avatar: string,
    @Arg("longitude") longitude: string,
    @Arg("latitude") latitude: string
  ): Promise<Driver | undefined> {
    await Driver.createQueryBuilder()
      .update()
      .set({ name, telephone, point, avatar, longitude, latitude })
      .where("id=:id", { id })
      .execute();
    return await Driver.findOne(id);
  }

  @UseMiddleware(Admin)
  @Mutation(() => Order)
  public async setDriverToOrder(
    @Arg("id") id: number,
    @Arg("orderId") orderId: string
  ): Promise<Order | undefined> {
    const driver = await Driver.findOne(id);
    if (!driver) {
      throw new Error("Driver Not Found!");
    }
    await Order.createQueryBuilder()
      .update()
      .set({ driverName: driver.name, driver })
      .where("id=:orderId", { orderId })
      .execute();

    return await Order.findOne(orderId);
  }

  @UseMiddleware(Admin)
  @Query(() => PaginatedDriverResponse)
  public async getDrivers(
    @Args() { page, limit }: PaginatedResponseArgs
  ): Promise<PaginatedDriverType> {
    const result = await Driver.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1],
    };
  }
}
