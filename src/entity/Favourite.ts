import { Entity, PrimaryGeneratedColumn,OneToMany, BaseEntity} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {Product} from "./Product";

@ObjectType()
@Entity()
export class Favourite extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToMany(() => Product, (product: Product) => product.favourite)
  public products: Product[];

}