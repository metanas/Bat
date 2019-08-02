import {Entity, PrimaryGeneratedColumn, ManyToOne, Column, BaseEntity, ManyToMany, JoinTable} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {Product} from "./Product";
import {Coupon} from "./Coupon";

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public quantity: number;

  @ManyToMany(() => Product)
  @JoinTable()
  public product: Product[];

  @ManyToOne(() => Coupon, (coupon: Coupon) => coupon.carts)
  public coupon: Coupon;


}