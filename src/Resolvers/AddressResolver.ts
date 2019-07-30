import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware,} from "type-graphql";
import {Address} from "../entity/Address";
import {ApiContext} from "../types/ApiContext";
import {User} from "../entity/User";
import {Auth} from "../Middleware/Auth";
import {getConnection} from "typeorm";

@Resolver()
export class AddressResolver {
  @UseMiddleware(Auth)
  @Query(() => Address, { nullable: true})
  public async getAddress(@Arg("id") id: number): Promise<Address | undefined> {
    return await Address.findOne({where: { id }})
  }

  @UseMiddleware(Auth)
  @Mutation(() => Address)
  public async addAddress(@Ctx() ctx: ApiContext, @Arg("address") address: string, @Arg("longitude") longitude: number, @Arg("latitude") latitude: number) {
    const user = await User.findOne({ where: { id: ctx.req.session!.token} });
    return await Address.create({
      address,
      longitude,
      latitude,
      user
    }).save();
  }

  @UseMiddleware(Auth)
  @Mutation(() => Address)
  public async UpdateAddress(@Arg("id") id: number, @Arg("address") address: string, @Arg("longitude") longitude: number, @Arg("latitude") latitude: number){
    return await getConnection()
      .createQueryBuilder()
      .update(Address)
      .set({address, longitude, latitude})
      .where("id=:id", {id})
      .execute();
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async deleteAddress(@Arg("id") id: number) {
    const address = getConnection().createQueryBuilder().delete().from(Address)
      .where("id=:id", {id}).execute();
    return !!address
  }

  @UseMiddleware(Auth)
  @Query(() => [Address])
  public async getAddresses(@Ctx() ctx: ApiContext, @Arg("page") page: number, @Arg("limit") limit: number): Promise<Address[]> {
    const user = await User.findOne({ where: { id: ctx.req.session!.token }});
    const result = await Address.findAndCount({where: {user}, skip: page, take: limit});
    return result[0];
  }
}
