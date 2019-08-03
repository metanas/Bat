import {Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity, ManyToMany, JoinTable, OneToMany} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {Product} from "./Product";
import {Coupon} from "./Coupon";
import {CartProduct} from "./CartProduct";

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToMany(() => Product)
  @JoinTable()
  public product: Product[];

  @ManyToOne(() => Coupon, (coupon: Coupon) => coupon.carts)
  public coupon: Coupon;

  @OneToMany(() => CartProduct, (cartProduct: CartProduct) => cartProduct.cart)
  public cartProducts: CartProduct[];


}