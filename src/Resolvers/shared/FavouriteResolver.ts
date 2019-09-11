import {Arg, Ctx, Mutation, Query,Resolver, UseMiddleware} from "type-graphql";
import {Costumer} from "../../entity/Costumer";
import {Auth} from "../../Middleware/Auth";
import {Favourite} from "../../entity/Favourite";
import {Product} from "../../entity/Product";
import {ApiContext} from "../../types/ApiContext";
import PaginatedResponse from "../../Modules/interfaces/PaginatedResponse";
import { ceil } from "lodash";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";

const PaginatedFavouriteResponse = PaginatedResponse(Favourite);
// @ts-ignore
type PaginatedFavouriteResponse = InstanceType<typeof PaginatedFavouriteResponse>;


@Resolver()
export class FavouriteResolver {
  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async addDelFavourite(@Ctx() ctx: ApiContext,@Arg("productId") productId: number) {
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    const product = await Product.findOne(productId);
    const idCostumer= ctx.req.session!.token;
    const favourite = await Favourite.findOne({ where:{ idCostumer, productId } });

    if (favourite) {
      const result= await Favourite
        .createQueryBuilder()
        .delete()
        .where("costumerId=:costumerId", { costumerId : ctx.req.session!.token  })
        .andWhere("productId=:productId",  {productId} )
        .execute();

      return !!result.affected

    }
    const result = await Favourite.create({
      costumer,
      product,
    }).save();
    return result !== undefined;
  }

  @Query(() => PaginatedFavouriteResponse)
  public async getProductsFavourite(@Arg() { page, limit }: PaginatedResponseArgs): Promise<PaginatedFavouriteResponse> {
    const result = await Favourite.findAndCount({ skip: (page - 1) * limit, take: limit });
    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}
