import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {ProductPicture} from "./ProductPicture";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public priceUnit: number;

  @Field()
  @Column()
  public quantity: number;

  @OneToMany(() => ProductPicture, (productPicture: ProductPicture) => productPicture.product)
  public productPictures: ProductPicture[];

}

