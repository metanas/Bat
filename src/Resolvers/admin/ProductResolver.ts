import {
  Arg,
  Args,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Product } from "../../entity/Product";
import { Category } from "../../entity/Category";
import { ProductArgs } from "../../Modules/inputs/ProductArgs";
import { In } from "typeorm";
import { ProductCategory } from "../../entity/ProductCategory";
import {
  PaginatedProductResponse,
  PaginateProductType,
} from "../../types/PaginatedResponseTypes";
import { PaginatedResponseArgs } from "../../Modules/inputs/PaginatedResponseArgs";
import { ceil } from "lodash";
import { Admin } from "../../Middleware/Admin";

@Resolver()
export class ProductResolver {
  @UseMiddleware(Admin)
  @Query(() => Product, { nullable: true })
  public async getProduct(@Arg("id") id: number): Promise<Product | undefined> {
    return await Product.findOne({
      where: { id },
      relations: ["productPictures", "productCategory"],
    });
  }

  @UseMiddleware(Admin)
  @Mutation(() => Product)
  public async addProduct(@Args() args: ProductArgs): Promise<Product> {
    const categories = await Category.find({
      where: { id: In(args.categoryIds) },
    });

    const product = await Product.create({
      name: args.name,
      priceCent: args.priceCent,
      weight: args.weight,
      quantity: args.quantity,
      unit: args.unit,
    }).save();

    for (let i = 0; i < categories.length; i++) {
      await ProductCategory.create({
        category: categories[i],
        product,
      }).save();
    }

    return product;
  }

  @UseMiddleware(Admin)
  @Mutation(() => Product)
  public async updateProduct(
    @Arg("id") id: number,
    @Args() args: ProductArgs
  ): Promise<Product | undefined> {
    const categories = await Category.find({
      where: { id: In(args.categoryIds) },
    });
    await Product.createQueryBuilder()
      .update()
      .set({
        name: args.name,
        priceCent: args.priceCent,
        quantity: args.quantity,
        unit: args.unit,
        weight: args.weight,
      })
      .where("id=:id", { id })
      .execute();

    await ProductCategory.createQueryBuilder()
      .delete()
      .where("productId=:id", { id })
      .execute();

    for (let i = 0; i < categories.length; i++) {
      await ProductCategory.create({
        category: categories[i],
        productId: id,
      }).save();
    }

    return await Product.findOne(id);
  }

  @UseMiddleware(Admin)
  @Mutation(() => Boolean)
  public async deleteProduct(@Arg("id") id: number): Promise<boolean> {
    const result = await Product.createQueryBuilder()
      .delete()
      .where("id=:id", { id })
      .returning("id")
      .execute();
    return !!result.affected;
  }

  @UseMiddleware(Admin)
  @Mutation(() => Product)
  public async toggleProduct(@Arg("id") id: number): Promise<Product> {
    const product = await Product.findOne(id);

    if (!product) {
      throw new Error("No Product Found");
    }

    await Product.createQueryBuilder()
      .update()
      .set({ enabled: !product.enabled })
      .where("id=:id", { id })
      .execute();

    await product.reload();

    return product;
  }

  @UseMiddleware(Admin)
  @Query(() => PaginatedProductResponse, { complexity: 10 })
  public async getProducts(
    @Arg("categoryId", { nullable: true }) categoryId: number,
    @Args() { page, limit, name }: PaginatedResponseArgs
  ): Promise<PaginateProductType> {
    let query = Product.createQueryBuilder("product").select();

    if (categoryId) {
      query = query
        .leftJoin("product.productCategory", "productCategory")
        .andWhere("productCategory.categoryId=:id", { id: categoryId });
    }

    if (name) {
      query = query.andWhere("product.name like :name", {
        name: "%" + name + "%",
      });
    }

    const result = await query
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      items: result[0],
      totalPages: ceil(result[1] / limit),
      totalCount: result[1],
    };
  }
}
