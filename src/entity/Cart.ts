import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import {Product} from "./Product";
import {Coupon} from "./Coupon";
import {CartProduct} from "./CartProduct";
import {User} from "./User";

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
  public coupon?: Coupon;

  @OneToMany(() => CartProduct, (cartProduct: CartProduct) => cartProduct.cart, { onDelete: "CASCADE" })
  public cartProducts?: CartProduct[];

  @Field(() => User)
  @OneToOne(() => User, (user: User) => user.cart)
  public user: User;
}
