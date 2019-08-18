import {Arg, Query, Resolver, UseMiddleware, Mutation} from "type-graphql";
import { Auth } from "../Middleware/Auth";
import { Product } from "../entity/Product";
import {Category} from "../entity/Category";
import PaginatedResponse from "../Modules/interfaces/PaginatedResponse";
import { ceil } from "lodash";
import {getConnection} from "typeorm";
import {PaginatedResponseInput} from "../Modules/inputs/PaginatedResponseInput";

const PaginatedProductResponse = PaginatedResponse(Product);
// @ts-ignore
type PaginatedProductResponse = InstanceType<typeof PaginatedProductResponse>


@Resolver()
export class ProductResolver {
  @UseMiddleware(Auth)
  @Query(() => Product, { nullable: true})
  public async getProduct(@Arg("id") id: number): Promise<Product | undefined> {
    return await Product.findOne({ where: { id }, relations: ["productPictures"] })
  }

  @UseMiddleware(Auth)
  @Mutation(() => Product)
  public async updateProduct(@Arg("id") id: number,@Arg("name") name: string,@Arg("priceUnit") priceUnit: number,@Arg("quantity") quantity: number){
    await getConnection()
      .createQueryBuilder()
      .update(Product)
      .set({ name, priceUnit, quantity })
      .where("id=:id",{ id })
      .execute();
    return await Product.findOne({ where: {id} });
  }

  @UseMiddleware(Auth)
  @Mutation(() => Product)
  public async addProduct(@Arg("name") name: string, @Arg("priceUnit") priceUnit: number, @Arg("quantity") quantity: number, @Arg("categoriesId") categoryId: number): Promise<Product> {
    const categories = await Category.find({ where : {id: categoryId }});
    return await Product.create({
      name,
      priceUnit,
      quantity,
      categories
    }).save();
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async deleteProduct(@Arg("id") id: number) {
    const result = await getConnection().createQueryBuilder().delete().from(Product)
      .where("id=:id", {id}).returning("id").execute();
    return !!result.affected
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedProductResponse)
  public async getProducts(@Arg("data") { page, limit }: PaginatedResponseInput): Promise<PaginatedProductResponse> {
    const result = await Product.findAndCount({ skip: (page - 1) * limit, take: limit });

    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}
