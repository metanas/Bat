import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Coupon} from "./Coupon";
import {CartProduct} from "./CartProduct";
import {User} from "./User";

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Coupon, (coupon: Coupon) => coupon.carts)
  public coupon?: Coupon;

  @Field(() => [CartProduct])
  @OneToMany(() => CartProduct, (cartProduct: CartProduct) => cartProduct.cart, { onDelete: "CASCADE" })
  @JoinTable()
  public cartProducts?: CartProduct[];

  @Field(() => User)
  @OneToOne(() => User, (user: User) => user.cart)
  @JoinColumn()
  public user: User;

  @Column({ name: "create_at" ,type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public create_at: string;
}
