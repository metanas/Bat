import {Arg, Query, Resolver, UseMiddleware, Mutation} from "type-graphql";
import { Auth } from "../Middleware/Auth";
import { Product } from "../entity/Product";
import {Category} from "../entity/Category";
import PaginatedResponse from "../Modules/interfaces/PaginatedResponse";
import { floor } from "lodash";
import {getConnection} from "typeorm";

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
    return await getConnection()
      .createQueryBuilder()
      .update(Product)
      .set({ name, priceUnit, quantity })
      .where("id=:id",{ id })
      .execute();
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
    const product = getConnection().createQueryBuilder().delete().from(Product)
      .where("id=:id", {id}).execute();
    return !!product
  }

  @UseMiddleware(Auth)
  @Query(() => PaginatedProductResponse)
  public async getProducts(@Arg("page") page: number, @Arg("limit") limit: number): Promise<PaginatedProductResponse> {
    const result = await Product.findAndCount({ skip: page - 1, take: limit });
    console.log(result);
    return {
      items: result[0],
      totalPages: floor(result[1] / limit),
      totalCount: result[1]
    };
  }
}
