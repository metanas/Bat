import { Resolver, Mutation, Arg } from "type-graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { ProductPicture } from "../../entity/ProductPicture";
import { Product } from "../../entity/Product";
import { getConnection } from "typeorm";
import { uploadImage } from "../../utils/uploadImage";

@Resolver()
export class ProductPictureResolver {
  @Mutation(() => Boolean)
  public async addProductPicture(
    @Arg("idProduct", { nullable: true }) id: number,
    @Arg("picture", () => GraphQLUpload)
    { createReadStream, filename }: FileUpload
  ) {
    const product = await Product.findOne({ where: { id } });
    await uploadImage(
      { createReadStream, filename },
      __dirname + "/../../images/"
    );
    const productPicture = ProductPicture.create({
      name: filename,
      path: __dirname + `/../../images/${filename}`,
      product,
    }).save();
    return !!productPicture;
  }

  @Mutation(() => Boolean)
  public async removeProductPicture(@Arg("idPicture") id: number) {
    return !!getConnection()
      .createQueryBuilder()
      .delete()
      .from(ProductPicture)
      .where("id=:id", { id })
      .execute();
  }
}
