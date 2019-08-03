import {Resolver, Mutation, Arg} from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import {Upload} from "../types/Upload";
import {ProductPicture} from "../entity/ProductPicture";
import { Product } from "../entity/Product";
import {getConnection} from "typeorm";
import {uploadImage} from "../utils/uploadImage";

@Resolver()
export class ProductPictureResolver {
  @Mutation(() => Boolean)
  public async addProductPicture(@Arg("idProduct") id: number, @Arg("picture", () => GraphQLUpload) {
    createReadStream,
    filename
  }: Upload){
    const product = await Product.findOne({where: {id}});
    await uploadImage({ createReadStream, filename }, (__dirname + "/../../images/"));
    const productPicture = ProductPicture.create({
      name: filename,
      path: "../../" + filename,
      product
    }).save();
    return !!productPicture;
  }

  @Mutation(() => Boolean)
  public async removeProductPicture(@Arg("idPicture") id: number) {
    return !!getConnection().createQueryBuilder().delete().from(ProductPicture).where("id=:id", {id}).execute()
  }

}
