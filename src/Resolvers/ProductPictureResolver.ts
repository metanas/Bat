import {Resolver, Mutation, Arg} from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import {Upload} from "../types/Upload";
import {createWriteStream} from "fs";
import {ProductPicture} from "../entity/ProductPicture";
import { Product } from "../entity/Product";
import {getConnection} from "typeorm";

@Resolver()
export class ProductPictureResolver {
  @Mutation(() => Boolean)
  public async addProductPicture(@Arg("idProduct") id: number, @Arg("picture", () => GraphQLUpload) {
    createReadStream,
    filename
  }: Upload){
    const product = await Product.findOne({where: {id}});
    return new Promise( (resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(__dirname + `/../../${filename}`))
        .on("finish", () => {
          ProductPicture.create({
            name: filename,
            path: "../../" + filename,
            product
          }).save();
          resolve(true) })
        .on("error", () => { reject(false) })
    });
  }

  @Mutation(() => Boolean)
  public async removeProductPicture(@Arg("idPicture") id: number) {
    return !!getConnection().createQueryBuilder().delete().from(ProductPicture).where("id=:id", {id}).execute()
  }

}
