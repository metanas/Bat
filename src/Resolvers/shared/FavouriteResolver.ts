import {Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Costumer} from "../../entity/Costumer";
import {Auth} from "../../Middleware/Auth";
import {Favourite} from "../../entity/Favourite";
import {Product} from "../../entity/Product";
import {ApiContext} from "../../types/ApiContext";
import { ceil } from "lodash";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";
import {In} from "typeorm";
import {PaginatedProductResponse} from "../../types/PaginatedResponseTypes";



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

  @Query(() => PaginatedProductResponse)
  public async getProductsFavourite(@Ctx() ctx: ApiContext,@Args() { page, limit }: PaginatedResponseArgs){
    const costumer = await Costumer.findOne(ctx.req.session!.token);
    const result = await Favourite.findAndCount({where :{costumer}, skip: (page - 1) * limit, take: limit , select: [ "productId" ] });
    const productIds : number [] = [] ;
    await result[0].forEach((favourite: Favourite ) => productIds.push(favourite.productId));
    const product = await Product.find({where :{ id : In(productIds) } });
    return {
      items: product,
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}