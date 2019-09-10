import {Arg, Ctx, Mutation, Resolver, UseMiddleware} from "type-graphql";
import {Costumer} from "../../entity/Costumer";
import {Auth} from "../../Middleware/Auth";
import {Favourite} from "../../entity/Favourite";
import {Product} from "../../entity/Product";
import {ApiContext} from "../../types/ApiContext";


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
}
