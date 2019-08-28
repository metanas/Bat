import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware,} from "type-graphql";
import {Address} from "../../entity/Address";
import {ApiContext} from "../../types/ApiContext";
import {Costumer} from "../../entity/Costumer";
import {Auth} from "../../Middleware/Auth";
import {getConnection} from "typeorm";
import PaginatedResponse from "../../Modules/interfaces/PaginatedResponse";
import { ceil } from "lodash";
import {PaginatedResponseInput} from "../../Modules/inputs/PaginatedResponseInput";

const PaginatedAddressResponse = PaginatedResponse(Address);
// @ts-ignore
type PaginatedAddressResponse = InstanceType<typeof PaginatedAddressResponse>;

@Resolver()
export class AddressResolver {
  @UseMiddleware(Auth)
  @Query(() => Address, { nullable: true})
  public async getAddress(@Arg("id") id: number): Promise<Address | undefined> {
    return await Address.findOne({where: { id }})
  }

  @UseMiddleware(Auth)
  @Mutation(() => Address)
  public async addAddress(@Ctx() ctx: ApiContext, @Arg("address") address: string, @Arg("longitude") longitude: string, @Arg("latitude") latitude: string) {
    const costumer = await Costumer.findOne({ where: { id: ctx.req.session!.token} });
    return await Address.create({
      address,
      longitude,
      latitude,
      costumer
    }).save();
  }

  @UseMiddleware(Auth)
  @Mutation(() => Address)
  public async updateAddress(@Arg("id") id: number, @Arg("address") address: string, @Arg("longitude") longitude: string, @Arg("latitude") latitude: string){
    await getConnection()
      .createQueryBuilder()
      .update(Address)
      .set({address, longitude, latitude})
      .where("id=:id", {id})
      .execute();

    return await Address.findOne({where: {id}});
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async deleteAddress(@Arg("id") id: number) {
    const result = await getConnection().createQueryBuilder().delete().from(Address)
      .where("id=:id", {id}).returning("id").execute();
    return !!result.affected
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedAddressResponse)
  public async getAddresses(@Ctx() ctx: ApiContext, @Arg("data") { page, limit }: PaginatedResponseInput ): Promise<PaginatedAddressResponse> {
    const costumer = await Costumer.findOne({ where: { id: ctx.req.session!.token }});
    const result = await Address.findAndCount({where: {costumer}, skip: (page - 1) * limit, take: limit});
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}
