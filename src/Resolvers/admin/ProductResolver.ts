import {Arg, Args, Mutation, Resolver, UseMiddleware, Query} from "type-graphql";
import {Auth} from "../../Middleware/Auth";
import {Product} from "../../entity/Product";
import {Category} from "../../entity/Category";
import {ProductArgs} from "../../Modules/inputs/ProductArgs";
import {FindManyOptions, In, Raw} from "typeorm";
import {ProductCategory} from "../../entity/ProductCategory";
import {PaginatedProductResponse} from "../../types/PaginatedResponseTypes";
import {PaginatedResponseArgs} from "../../Modules/inputs/PaginatedResponseArgs";
import { set, ceil } from "lodash";

@Resolver()
export class ProductResolver {
  @Query(() => Product, {nullable: true})
  public async getProduct(@Arg("id") id: number) {
    return await Product.findOne({where: {id}, relations: ["productPictures", "productCategory"]})
  }

  @Mutation(() => Product)
  public async addProduct(@Args() args: ProductArgs): Promise<Product> {
    const categories = await Category.find({ where: { id: In(args.categoryIds) } });

    const product = await Product.create({
      name: args.name,
      priceCent: args.priceCent,
      weight: args.weight,
      quantity: args.quantity,
      unit: args.unit
    }).save();

    for(let i= 0; i < categories.length; i++) {
      await ProductCategory.create({
        category: categories[i],
        product
      }).save()
    }

    return product
  }

  @UseMiddleware(Auth)
  @Mutation(() => Product)
  public async updateProduct(@Arg("id") id: number, @Args() args: ProductArgs){
    const categories = await Category.find({ where: { id: In(args.categoryIds) }});
    await Product
      .createQueryBuilder()
      .update()
      .set({
        name: args.name,
        priceCent: args.priceCent,
        quantity: args.quantity,
        unit: args.unit,
        weight: args.weight})
      .where("id=:id",{ id })
      .execute();

    await ProductCategory.createQueryBuilder()
      .delete()
      .where("productId=:id", { id })
      .execute();

    for(let i= 0; i < categories.length; i++) {
      await ProductCategory.create({
        category: categories[i],
        productId: id
      }).save();
    }

    return await Product.findOne(id);
  }

  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  public async deleteProduct(@Arg("id") id: number) {
    const result = await Product.createQueryBuilder().delete()
      .where("id=:id", {id}).returning("id").execute();
    return !!result.affected
  }

  @Mutation(() => Product)
  public async toggleProduct(@Arg("id") id: number) {
    const product = await Product.findOne(id);

    if(!product) {
      throw new Error("No Product Found")
    }

    await Product.createQueryBuilder()
      .update()
      .set({ enabled: !product.enabled })
      .where("id=:id", { id })
      .execute();

    await product.reload();

    return product;
  }

  @Query(() => PaginatedProductResponse, { complexity: 10 })
  public async getProducts(@Arg("categoryId", { nullable: true }) categoryId: number, @Args() { page, limit, name }: PaginatedResponseArgs) {
    const options: FindManyOptions = {
      skip: (page - 1) * limit,
      take: limit,

    };

    if(categoryId) {
      const productIds: number[] = [];
      const productCategory = await ProductCategory.find({ where: {categoryId}, select: ["productId"]});
      await productCategory.forEach(product => productIds.push(product.productId));
      set(options, "where.id", In(productIds));
    }

    if(name) {
      set(options, "where.name", Raw(columnAlias => `lower(${columnAlias}) like '%${name.toLowerCase()}%'`));
    }

    const result = await Product.findAndCount(options);

    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1]
    };
  }
}
